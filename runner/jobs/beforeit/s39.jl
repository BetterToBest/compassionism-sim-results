# S39 (Nov 8, 2026): the outside engine cross-check (research-update prereg/2026-11-s39-outside-crosscheck.md).
#
# BeforeIT.jl (Bank of Italy; Poledna, Miess, Hommes and Rabitsch 2023, "Economic forecasting with an agent-based model",
# European Economic Review 151) is run on its Austrian calibration (2010Q1) at full population scale (one agent per person
# and per firm), with a Basic Unit and conversion module added here. Nothing in BeforeIT's package code is edited: the
# module overloads two of its functions (the social benefit rule and, in one closure, the central bank rate) and acts
# through BeforeIT's own shock hook, the documented ways of extending it (examples/scenario_analysis_via_overload.jl).
#
# The module (one setting per run, held in S39CFG):
#   inject   the share of the economy's household income paid out each quarter as new money: a transfer of equal size to
#            every person (BeforeIT's households all have the same propensity to consume, so who receives it does not
#            change aggregate demand), added to BeforeIT's per-person "other social benefits" and so counted in the
#            government's spending. Each quarter's payout is share(year) x the households' total nominal income of the
#            previous quarter (payouts included), the way the Compassionism engine's U/Y counts conversion pay in Y.
#   finance  :deficit  the payout adds to the government's deficit (BeforeIT has no separate money and bond accounts: the
#                      deficit ends as household deposits; this is the reading of the engine's unmatched new money).
#            :tax      a surcharge on the income tax rate (wages and dividends) set each quarter to the previous quarter's
#                      payout over the previous quarter's tax base, so the payout is financed by taxes (capped at 0.95).
#   cb       :ea       the euro-area central bank of the calibration: its Taylor rule reads euro-area inflation and growth
#                      (exogenous to Austria), as in BeforeIT.
#            :domestic the same Taylor rule and parameters fed Austria's own inflation and growth: a closure where the
#                      central bank answers the programme's inflation, as a national central bank would (the US case).
#
# Scale: BeforeIT's packaged Austria is 1:1000 (one agent per 1,000 people). Its calibration code
# (src/utils/calibration.jl, get_params_and_initial_conditions, keyword scale) multiplies the counts of people and firms by
# the scale and divides the per-agent amounts (output and wages per worker, benefits per person) by it, leaving the national
# totals as they are. scaled(f) applies the same rule to the packaged 1:1000 Austria (f = 1000 gives 1:1).
import BeforeIT as Bit
using Random, JSON, Statistics

const ESS = Dict("food" => [1, 5], "housing" => [44, 24, 25], "medical" => [56, 12])  # A01, C10-12; L68, D35, E36; Q86, C21

function scaled(f)
    p = deepcopy(Bit.AUSTRIA2010Q1.parameters); ic = deepcopy(Bit.AUSTRIA2010Q1.initial_conditions)
    if f != 1
        for k in ("H_act", "H_inact", "J", "L"); p[k] = round(Int, p[k] * f); end
        p["I_s"] = round.(Int, p["I_s"] .* f)
        for k in ("alpha_s", "w_s"); p[k] = p[k] ./ f; end
        ic["N_s"] = round.(Int, ic["N_s"] .* f)
        for k in ("sb_inact", "sb_other", "w_UB"); ic[k] = ic[k] / f; end
    end
    return p, ic
end

Base.@kwdef mutable struct S39Cfg
    share::Vector{Float64} = Float64[]   # per year (quarters 4y-3..4y); empty = no payout
    finance::Symbol = :deficit
    cb::Symbol = :ea
    sb_base::Float64 = NaN               # BeforeIT's own per-person benefit path, kept apart from the payout
    extra::Float64 = 0.0                 # this quarter's payout, real, per person
    paid::Float64 = 0.0                  # this quarter's payout, nominal
    tau0::Float64 = NaN
    prev_income::Float64 = 0.0
    prev_paid::Float64 = 0.0
    prev_base::Float64 = 0.0
end
const S39CFG = Ref(S39Cfg())

persons(m) = length(m.w_act) + length(m.w_inact) + length(m.firms) + 1
hh_income(m) = sum(m.w_act.Y_h) + sum(m.w_inact.Y_h) + sum(m.firms.Y_h) + m.bank.Y_h

# the social benefit rule: BeforeIT's own (other benefits grow with expected growth), plus the payout per person
function Bit.gov_social_benefits(model::Bit.AbstractModel)
    c = S39CFG[]; gamma_e = model.agg.gamma_e
    isnan(c.sb_base) && (c.sb_base = model.gov.sb_other)
    c.sb_base = c.sb_base * (1 + gamma_e)
    return c.sb_base + c.extra, model.gov.sb_inact * (1 + gamma_e)
end

function Bit.central_bank_rate(model::Bit.AbstractModel)
    cb = model.cb; c = S39CFG[]
    if c.cb === :domestic
        a = model.agg; k = model.prop.T_prime + a.t - 1      # last completed quarter (BeforeIT's own history arrays)
        g = a.Y[k] / a.Y[k - 1] - 1; pi = exp(a.pi_[k]) - 1   # Austria's own growth and inflation, in place of the euro area's
        return Bit.taylor_rule(cb.rho, cb.r_bar, cb.r_star, cb.pi_star, cb.xi_pi, cb.xi_gamma, g, pi)
    end
    return Bit.taylor_rule(cb.rho, cb.r_bar, cb.r_star, cb.pi_star, cb.xi_pi, cb.xi_gamma, model.rotw.gamma_EA, model.rotw.pi_EA)
end

# set this quarter's payout (and tax surcharge) before firms and households decide: BeforeIT's shock hook
function payout!(model)
    c = S39CFG[]; t = model.agg.t; y = (t - 1) ÷ 4 + 1
    isnan(c.tau0) && (c.tau0 = model.prop.tau_INC)
    s = isempty(c.share) ? 0.0 : c.share[min(y, length(c.share))]
    c.paid = s * c.prev_income
    c.extra = c.paid / (persons(model) * model.agg.P_bar_HH)
    if c.finance === :tax && c.prev_base > 0
        model.prop.tau_INC = min(0.95, c.tau0 + c.prev_paid / c.prev_base)
    end
    return nothing
end

function taxbase(m)
    p = m.prop; wages = sum(m.w_act.w_h[m.w_act.O_h .!= 0])
    return (1 - p.tau_SIW) * m.agg.P_bar_HH * wages + (1 - p.tau_FIRM) * p.theta_DIV * (sum(max.(0, m.firms.Pi_i)) + max(0, m.bank.Pi_k))
end

ess_index(m, k) = (ix = ESS[k]; w = vec(m.prop.b_HH_g)[ix]; sum(w .* m.agg.P_bar_g[ix]) / sum(w))

"""
    run_one(f, quarters, seed, cfg) -> Dict of quarterly series
"""
function run_one(f, quarters, seed, cfg::S39Cfg; parallel = Threads.nthreads() > 1)
    S39CFG[] = cfg
    p, ic = scaled(f)
    Random.seed!(seed)
    m = Bit.Model(p, ic)
    cfg.prev_income = hh_income(m)
    out = Dict{String, Vector{Float64}}(k => Float64[] for k in
        ("cpi", "deflator", "food", "housing", "medical", "real_gdp", "nominal_gdp", "hh_income", "paid", "share_paid",
         "unemp", "gov_debt_gdp", "r_bar", "tau_inc", "real_wage", "pi_e"))
    for q in 1:quarters
        Bit.step!(m; parallel, shock! = payout!)
        Bit.collect_data!(m)
        inc = hh_income(m)
        push!(out["cpi"], m.agg.P_bar_HH); push!(out["deflator"], m.agg.P_bar)
        for k in ("food", "housing", "medical"); push!(out[k], ess_index(m, k)); end
        push!(out["real_gdp"], m.data.real_gdp[end]); push!(out["nominal_gdp"], m.data.nominal_gdp[end])
        push!(out["hh_income"], inc); push!(out["paid"], cfg.paid); push!(out["share_paid"], cfg.prev_income > 0 ? cfg.paid / cfg.prev_income : 0.0)
        push!(out["unemp"], count(==(0), m.w_act.O_h) / length(m.w_act))
        push!(out["gov_debt_gdp"], m.gov.L_G / m.data.nominal_gdp[end]); push!(out["r_bar"], m.cb.r_bar)
        push!(out["tau_inc"], m.prop.tau_INC); push!(out["pi_e"], m.agg.pi_e)
        emp = m.w_act.O_h .!= 0
        push!(out["real_wage"], mean(m.w_act.w_h[emp]))
        cfg.prev_paid = cfg.paid; cfg.prev_base = taxbase(m); cfg.prev_income = inc
    end
    S39CFG[] = S39Cfg()
    return out
end
