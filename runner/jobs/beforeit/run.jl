# S39: run the scenarios of research-update prereg/2026-11-s39-outside-crosscheck.md for a range of run indices.
# julia --project=DIR -t 1 run.jl SCALE QUARTERS REPS FROM TO SHARES.json OUT.json
# Run index i (1-based) is scenario SCEN[(i-1) ÷ REPS + 1] on seed (i-1) % REPS + 1: every scenario runs on seeds 1..REPS, so each is
# paired with its baseline (same closure) seed by seed. One thread: BeforeIT's threaded goods market does not repeat a seed exactly.
include(joinpath(@__DIR__, "s39.jl"))
const SCALE, Q, REPS, FROM, TO = parse(Float64, ARGS[1]), parse(Int, ARGS[2]), parse(Int, ARGS[3]), parse(Int, ARGS[4]), parse(Int, ARGS[5])
const SH = JSON.parsefile(ARGS[6])
sh(k) = Float64.(SH["shares"][k])
const SCEN = [
    ("base-ea",          () -> S39Cfg()),
    ("base-dom",         () -> S39Cfg(cb = :domestic)),
    ("c22-ref-ea",       () -> S39Cfg(share = sh("c22.ref"))),
    ("c22-ref-dom",      () -> S39Cfg(share = sh("c22.ref"), cb = :domestic)),
    ("c22-adv-ea",       () -> S39Cfg(share = sh("c22.adv"))),
    ("c22-st-ea",        () -> S39Cfg(share = sh("c22.st"))),
    ("rls-ref-ea",       () -> S39Cfg(share = sh("rls.ref"))),
    ("c22-ref-gross-ea", () -> S39Cfg(share = sh("c22.ref.gross"))),
    ("c22-ref-tax-ea",   () -> S39Cfg(share = sh("c22.ref"), finance = :tax)),
    ("dose01-ea",        () -> S39Cfg(share = [0.01])),
    ("dose03-ea",        () -> S39Cfg(share = [0.03])),
    ("dose10-ea",        () -> S39Cfg(share = [0.10])),
    ("dose30-ea",        () -> S39Cfg(share = [0.30])),
]
FROM >= 1 && TO <= REPS * length(SCEN) || error("run indices 1..$(REPS * length(SCEN))")
runs = Any[]
for i in FROM:TO
    name, mk = SCEN[(i - 1) ÷ REPS + 1]; seed = (i - 1) % REPS + 1
    t = @elapsed r = run_one(SCALE, Q, seed, mk(); parallel = false)
    println(stderr, "run $i: $name seed $seed, $(round(t, digits = 1)) s"); flush(stderr)
    push!(runs, Dict("index" => i, "scenario" => name, "seed" => seed, "seconds" => t, "series" => r))
end
open(ARGS[7], "w") do io
    JSON.print(io, Dict("scenarios" => first.(SCEN), "reps" => REPS, "scale" => SCALE, "quarters" => Q, "runs" => runs,
        "julia" => string(VERSION), "beforeit" => string(pkgversion(Bit)), "shares_used" => SH))
end
