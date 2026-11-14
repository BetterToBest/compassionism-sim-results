#!/usr/bin/env node
/* S63 part 2 (Nov 14, 2026): the round-2 batch of the Compassionism Simulation, as preregistered in research-update prereg/2026-11-s63-round2-freeze.md
 * (with its Amendment 1). Every point is a pair: the programme run(s) and the no-programme run, every reading applied to both runs. The engine is not
 * changed by this script: every reading is a row option of the pinned engine.
 *
 * The main row (ledger D25, D26): harness.js r2FreezePair: r2MainRow (the round-2 candidate main row) with S69's two reporting corrections on (fx.ez,
 * fx.rk) and the programme run at full backing (o.a 1, the design's statement, a design parameter); today's price rule (no pr).
 *
 * Parts (one results folder per part, environment and horizon: r2-<part>-<env>-<years>-<engine 7>):
 *   M  the main rows, every output key at full precision: the no-programme run, C2.2 and the release design (r2FreezePair, untouched), and the
 *      financed main rows (their own no-programme run and the two financed designs).
 *   S  the Source rows (prereg Design, "Rows: the Source rows", items 1-7): the main point, the single readings, the pairs, the least-favourable bound,
 *      the backing curve (with the price rule's readings at no assumed backing), the named readings and the fixed PTF share rows.
 *   F  the financed rows (items 1-4 of "Rows: the financed rows"): run without the weighted tail (S72 Amendment 2), the government account on, the
 *      programme paid for by a contribution (o.fin 'tax'), the part it does not raise met as fx.fin says; backed share 0, as S70 and S72 ran them.
 *   B  the main pair at 10,000 adults (no-programme run, C2.2, release design; r2FreezePair), every output key.
 * Parts S and F store the keys in KEYS (and the derived yearly averages) at 7 significant digits; parts M and B every key the engine reports.
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/r2.js --part=M|S|F|B --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--points=A-B]
 *   node RESULTS/runner/jobs/r2.js --part=all --seeds=A-B --out=FILE [--procs=K]   (the dry run: every part, environment and horizon in one file)
 *   node RESULTS/runner/jobs/r2.js --check           (the design against the preregistration; prints every point, the pair ends and bound ends)
 *   node RESULTS/runner/jobs/r2.js --selftest        (setters at main reproduce the main pair; every point runs; in an engine checkout)
 * --procs=K cuts the points (part B: the rows) into K pieces run as K processes and joins them (the same bytes as one process). --points runs a subset.
 * FILE holds only deterministic content; seconds and memory go to stderr and to FILE without .json plus .timing.json. */
'use strict';
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', str: 'STRESS_TEST'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const ENDS = JSON.parse(fs.readFileSync(path.join(__dirname, 'r2-ends.json'), 'utf8'));
/* the keys stored for parts S and F; ppovA and pmedWA (the yearly averages over years 1 to T-1) and, at 40 years, ppov20 and pmedW20 are derived */
const KEYS = ['bNAPy', 'fgt0PY', 'pov', 'wtMedE', 'medWealthReal', 'endoAnn', 'cost', 'tauMean', 'gvDebtY', 'gvY100', 'finGapSh', 'wyF0PY', 'emp', 'hrs',
  'lfPart', 'lfOut', 'lpOut', 'lpE', 'bkPY', 'mfUY', 'dmWt1E', 'dmWt10E', 'dmYt1E', 'dmYt10E', 'dmYpE', 'dmWrE', 'dmFdE', 'dmLsPY'];
const DIGITS = 7;
/* the S70 job's setters (runner/jobs/s70-screen.js, copied unchanged): same names, ranges and row options */
const pr = c => { c.pr = Object.assign({k2: 0.051, q: 1, bv: 0}, c.pr || {}); return c.pr; };
const o = c => { c.o = Object.assign({}, c.o || {}); return c.o; };
const po = c => { c.po = Object.assign({}, c.po && typeof c.po === 'object' ? c.po : {}); return c.po; };
const lf = c => { c.lf = Object.assign({}, c.lf || {}); return c.lf; };
const cr = c => { c.rt.cr = Object.assign({}, c.rt.cr && typeof c.rt.cr === 'object' ? c.rt.cr : {}); return c.rt.cr; };
const wt = c => { c.wt = Object.assign({}, c.wt && typeof c.wt === 'object' ? c.wt : {}); return c.wt; };
const gv = c => { c.gv = Object.assign({}, c.gv || {}); return c.gv; };
const COMMON = [
  /* the price rule (S58, S67): today's rule is the corner k 1, r 0, a 0, h 0, rs false; the capacity rule's main values lie inside the box */
  ['prK', 'c', [0.2, 1], 'price rule: response to excess demand, kappa (S58 0.445, one standard error 0.240 either way; 1 is today\'s rule)', (c, v) => { pr(c).k = v; }],
  ['prR', 'c', [0, 0.45], 'price rule: persistence of last year\'s inflation, rho (S67: 0 to 0.45)', (c, v) => { pr(c).r = v; }],
  ['prA', 'c', [0, 0.5078], 'price rule: weight on wage indexation, alpha (0 today; S58 0.5078)', (c, v) => { pr(c).a = v; }],
  ['prH', 'c', [0, 0.0446], 'price rule: normal-years slack in the general price, h (S58 swept 0.0446)', (c, v) => { pr(c).h = {gen: v}; }],
  ['prRs', 'k', [false, true], 'price rule: recession slack (off as today\'s rule; on in S58\'s rule)', (c, v) => { pr(c).rs = v; }],
  ['prBd', 'c', [0, 0.132], 'price rule: velocity drift, bd (S67: 0.132 from the inflation episodes)', (c, v) => { pr(c).bd = v; }],
  ['sc', 'c', [0.593, 0.877], 'share of cash surplus spent (0.593 the published engine, 0.877 the frozen model)', (c, v) => { c.sc = v; }],
  ['wIdx', 'c', [0.75, 1], 'wage indexation to the programme\'s price level (S51 swept 0.75 to 1)', (c, v) => { o(c).wIdx = v; }],
  ['rho', 'c', [0.05, 0.30], 'income effect: earnings forgone per unconditional dollar (0.16 main; v5.4 screen\'s range)', (c, v, p, H) => { o(c).labor = Object.assign({}, H.LABOR_DEFAULTS, {rho: v, rhoBU: v}); }],
  ['paDem', 'c', [0.49, 1], 'PTF demand ceiling (0.49 main; 1 no ceiling)', (c, v) => { c.pa = Object.assign({}, c.pa && typeof c.pa === 'object' ? c.pa : {}, {dem: v}); }],
  ['drLim', 'c', [0, 10000], 'borrowing limit for ordinary spending, $ (S61 swept 0 to 10,000; 2,500 main)', (c, v) => { c.dr = Object.assign({}, c.dr || {}, {lim: v}); }],
  ['lfConv', 'k', ['keep', 'none'], 'conversion by adults outside the labour force (keep main; none)', (c, v) => { lf(c).conv = v; }],
  ['lfFl', 'k', ['stock', 'off'], 'yearly flows in and out of the labour force (stock main; off: S61\'s fixed reading)', (c, v) => { if (v === 'off') delete lf(c).fl; else lf(c).fl = v; }],
  ['lfPm', 'c', [0, 1], 'share of the income effect taken by leaving work, pm (0.43 main; S73 swept 0 to 1)', (c, v) => { lf(c).pm = v; }],
  ['rtPhi', 'c', [0, 1], 'pass-through of inflation to nominal assets\' interest, phi (0.46 main; S59 swept 0 and 1)', (c, v) => { c.rt.phi = v; }],
  ['rtNs', 'k', ['nom', 'port'], 'where new saving goes (nominal assets main; port: the group\'s asset shares)', (c, v) => { c.rt.ns = v; }],
  ['rtIx', 'c', [0.5, 1], 'share of inflation real assets follow, ix (1 main; S59 half indexing)', (c, v) => { c.rt.ix = v; }],
  ['rtChi', 'c', [0, 1], 'repricing of fixed-rate debt, chi (0 main: debt relief; 1 none)', (c, v) => { c.rt.chi = v; }],
  ['bgPi', 'c', [0, 0.10], 'bargaining pass-through, pi (0 main; S60: 0.03 and 0.10 the evidence\'s range)', (c, v) => { c.bg = Object.assign({}, c.bg, {pi: v}); }],
  ['bgM', 'c', [1/1.53, 1], 'the markdown, pay over what workers add (1/1.21 main; 1/1.53 manufacturing; 1 none)', (c, v) => { c.bg = Object.assign({}, c.bg, {m: v}); }],
  ['poCost', 'k', ['full', 'sector', 'hub'], 'PTF running cost (full main; sector: observed costs; hub: the Hub\'s costs as stated)', (c, v) => { po(c).cost = v; }],
  ['poRes', 'c', [0, 0.017], 'PTF reserve (0.017 main; 0 none)', (c, v) => { po(c).res = v; }],
  ['poW', 'c', [0.10, 0.40], 'half-width of the density tests\' band (0.20 main; S62 swept 0.10 and 0.40)', (c, v) => { po(c).w = v; }],
  ['poTest', 'k', ['sales', 'members', 'capacity'], 'what the density tests read (sales main; members; capacity)', (c, v) => { po(c).test = v; }],
  ['poHire', 'k', [null, 0.05, 0.02], 'PTF hiring limit, points a year (none main; 0.05 and 0.02 stress readings)', (c, v) => { po(c).hire = v; }],
  ['poBonus', 'k', ['workers', 'members'], 'who gets the conversion bonus (PTF workers main; members)', (c, v) => { po(c).bonus = v; }],
  ['poPay', 'k', ['source', 'price'], 'who pays the PTF cut\'s running cost (the Source main; price: PTF prices rise)', (c, v) => { po(c).pay = v; }],
  ['crInc', 'k', ['pass', 'hold', 'hedge'], 'creditor side: who bears the inflated debt (pass main; hold; hedge)', (c, v) => { cr(c).inc = v; }],
  ['crOut', 'k', [1, 0], 'creditor side: the government\'s and foreigners\' parts left outside (1 main; 0 every dollar on a model household)', (c, v) => { cr(c).out = v; }],
  ['crPop', 'k', [0, 1], 'creditor side: the model\'s families as the whole household sector (0 main; 1)', (c, v) => { cr(c).pop = v; }]];
const TAIL = [
  ['wtCut', 'k', ['main', 'p99', 'p90'], 'where the weighted tail starts (main: the rule\'s 97.5th percentile; p99; p90)', (c, v) => { wt(c).cut = v; }],
  ['wtA', 'c', [-0.136, 0.136], 'the tail exponent, shift from the cut\'s own value (one standard error either way: 1.354 to 1.626 at the main cut)', (c, v, p, H) => { wt(c).aShift = v; }],
  ['wtM', 'i', [3, 6], 'tail households per type (3 main; S59 swept 6)', (c, v) => { wt(c).m = v; }]];
const FIN = [
  ['gvSh', 'c', [0, 1], 'share of the programme\'s cost the contribution is asked to raise (1 main)', (c, v, p) => { if (p) gv(c).sh = v; }],
  ['gvBase', 'k', ['w', 'wc', 'all'], 'the contribution\'s base (wages main; wages and capital income; all money income)', (c, v, p) => { if (p) gv(c).base = v; }],
  ['cap', 'c', [0, 1], 'the rate cap: 0.5 to 0.9 (fx.fin money or debt), 0.95 to 0.99 (fx.fin cap)', (c, v, p) => { if (p) c._capU = v; }],
  ['fin', 'k', ['debt', 'money', 'cap'], 'how the part the contribution does not raise is met (debt: borrowed; money: new money; cap: the cap raised)', (c, v, p) => { if (p) c._fin = v; }],
  ['gvRr', 'c', [0, 0.0196], 'real interest rate on public debt, fixed reading (0.0097 main)', (c, v) => { gv(c).rr = v; }],
  ['gvDk', 'c', [0, 0.04], 'interest-rate premium per 100% of GDP of debt (0.04 main)', (c, v) => { gv(c).dk = v; }],
  ['gvR', 'k', ['fixed', 'rule'], 'the interest rate: fixed real rate (main) or the policy-rate rule', (c, v) => { gv(c).r = v; }],
  ['gvA', 'c', [0.25, 1], 'policy-rate rule: response to inflation, a (0.5 main)', (c, v) => { gv(c).a = v; }],
  ['gvB', 'c', [0, 1], 'policy-rate rule: response to the output gap, b (0.5 main)', (c, v) => { gv(c).b = v; }],
  ['gvRs', 'c', [0, 0.02], 'policy-rate rule: the neutral real rate, rs (0.0097 main)', (c, v) => { gv(c).rs = v; }],
  ['gvIp', 'k', ['tax', 'borrow'], 'interest on the debt paid by the contribution (main) or borrowed', (c, v) => { gv(c).ip = v; }]];
const IN = {S: COMMON.concat(TAIL), F: COMMON.concat(FIN)};

/* the main row's reading of every input (as the S70 job's selftest MAIN); the financed C2.2 row's base is all money income (S72), the release design's wages */
const MAIN0 = {prK: 1, prR: 0, prA: 0, prH: 0, prRs: false, prBd: 0, wIdx: 1, paDem: 0.49, drLim: 2500, lfConv: 'keep', lfFl: 'stock', lfPm: 0.43,
  rtPhi: 0.46, rtNs: 'nom', rtIx: 1, rtChi: 0, bgPi: 0, bgM: 1/1.21, poCost: 'full', poRes: 0.017, poW: 0.20, poTest: 'sales', poHire: null, poBonus: 'workers', poPay: 'source',
  crInc: 'pass', crOut: 1, crPop: 0, wtCut: 'main', wtA: 0, wtM: 3, gvSh: 1, gvBase: 'w', cap: 1, fin: 'debt', gvRr: 0.0097, gvDk: 0.04, gvR: 'fixed', gvA: 0.5, gvB: 0.5, gvRs: 0.0097, gvIp: 'tax'};
const mainOf = (H, block, row) => Object.assign({}, MAIN0, {sc: H ? H.SPEND_FROZEN : 0.877, rho: H ? H.LABOR_DEFAULTS.rho : 0.16}, block === 'F' && row === 'c22' ? {gvBase: 'all'} : {});
/* inputs that act only under another input's reading (S70 rule 6): their single readings and pairs are taken there, against that reading's own point */
const COND = {S: {bgM: {bgPi: 0.10}}, F: {bgM: {bgPi: 0.10}, gvA: {gvR: 'rule'}, gvB: {gvR: 'rule'}, gvRs: {gvR: 'rule'}}};
const BKM = {f: 1, rho: 0.32, lag: 2, dep: 0.05, acct: 'growth', cap: 0.08};  /* S51's main reading (added output only, ceiling 8%, lag 2, wear 5%) at its most productive setting shown */
/* named modifications applied after the setters (row c, programme run or not) */
const MODS = {
  a: (c, p, v) => { if (p) c.o = Object.assign({}, c.o, {a: v}); },
  bkm: (c, p) => { if (p) c.o = Object.assign({}, c.o, {a: 0, bkm: Object.assign({}, BKM)}); },
  bkmNc: (c, p) => { if (p) { const b = Object.assign({}, BKM); delete b.cap; c.o = Object.assign({}, c.o, {a: 0, bkm: b}); } },
  rtOff: c => { delete c.rt; },
  crOff: c => { delete c.rt.cr; c.rt.chi = 1; },
  wtOff: c => { delete c.wt; },
  lfOff: c => { delete c.lf; },
  liq: c => { c.dr = Object.assign({}, c.dr, {liq: 0.046}); },
  floor: c => { c.dr = Object.assign({}, c.dr, {fl: 'fpl'}); },
  prCap: c => { c.pr = true; },
  prQ: c => { c.pr = {q: 4, k: 0.0788, k2: 0, r: 0.2333}; },
  s69Off: c => { delete c.fx.ez; delete c.fx.rk; },
  fix: (c, p, v) => { if (p) c.pa = Object.assign({}, c.pa && typeof c.pa === 'object' ? c.pa : {}, {fix: v, grow: false}); }};
const ROWS3 = ['none', 'c22', 'rel'], PROG = ['c22', 'rel'];
const show = v => v === null ? 'none' : typeof v === 'number' ? String(+v.toPrecision(4)) : String(v);
const spec = (block, n) => IN[block].find(x => x[0] === n);

function design(block) {
  const pts = [], byKey = {}, M = mainOf(null, block, 'c22');
  const add = (id, kind, x, rows, mod) => {
    const xs = {}; Object.keys(x).sort().forEach(n => { if (x[n] !== M[n] || (block === 'F' && n === 'gvBase')) xs[n] = x[n]; });
    const k = JSON.stringify([xs, mod || null]);
    if (byKey[k] !== undefined) { const q = pts[byKey[k]]; q.alias.push(id); rows.forEach(r => { if (!q.rows.includes(r)) q.rows.push(r); }); q.rows.sort((a, b) => ROWS3.indexOf(a) - ROWS3.indexOf(b)); return q.p; }
    byKey[k] = pts.length; pts.push({p: pts.length, id, kind, x: xs, mod: mod || null, rows: rows.slice(), alias: []}); return pts.length - 1;
  };
  const cond = n => COND[block][n] || {};
  add('main', 'main', {}, ROWS3);
  const carried = ENDS.carried[block], single = {};
  carried.forEach(([n, rule, reading]) => { const s = spec(block, n), m = M[n];
    const ends = rule === 'one' ? [reading] : s[1] === 'k' ? s[2].filter(v => v !== m) : s[2].filter(v => v !== m);
    if (block === 'F' && n === 'gvBase') {  /* the base's main differs by design (C2.2 all money income, the release design wages): each base, run for the designs it moves */
      s[2].forEach(v => { const rows = ['none'].concat(PROG.filter(d => mainOf(null, 'F', d).gvBase !== v)); single[n + '=' + v] = add('single.' + n + '=' + v, 'single', {[n]: v}, rows); }); return; }
    ends.forEach(v => { const x = Object.assign({}, cond(n), {[n]: v}); single[n + '=' + show(v)] = add('single.' + n + '=' + show(v), 'single', x, ROWS3); }); });
  const pairs = ENDS.pairs[block].map(q => { const [A, B] = q.pair.split(' x '), C = Object.assign({}, cond(A), cond(B));
    const base = add('pairbase.' + q.pair, 'pairbase', C, ROWS3), a = add('pairA.' + q.pair, 'pairA', Object.assign({}, C, {[A]: q.ends[A]}), ROWS3),
      b = add('pairB.' + q.pair, 'pairB', Object.assign({}, C, {[B]: q.ends[B]}), ROWS3), ab = add('pair.' + q.pair, 'pair', Object.assign({}, C, {[A]: q.ends[A], [B]: q.ends[B]}), ROWS3);
    return {pair: q.pair, ends: q.ends, points: {base, a, b, both: ab}}; });
  const bound = {}; ['c22', 'rel'].forEach(d => { bound[d] = {}; Object.keys(ENDS.bound[block][d]).forEach(k => {
    bound[d][k] = add('bound.' + d + '.' + k, 'bound', ENDS.bound[block][d][k].readings, ['none', d]); }); });
  if (block === 'S') {
    [0, 0.25, 0.5, 0.75].forEach(a => add('back.a=' + a, 'backing', {}, PROG, 'a=' + a));
    add('back.bkm', 'backing', {}, PROG, 'bkm'); add('back.bkmNc', 'backing', {}, PROG, 'bkmNc');
    [['prK', 0.2], ['prR', 0.45], ['prA', 0.5078], ['prH', 0.0446], ['prBd', 0.132]].forEach(([n, v]) => add('a0.' + n + '=' + v, 'a0price', {[n]: v}, ROWS3, 'a=0'));
    ['rtOff', 'crOff', 'wtOff', 'lfOff', 'liq', 'floor', 'prCap', 'prQ', 's69Off'].forEach(m => add('named.' + m, 'named', {}, ROWS3, m));
    [['drLim', 0], ['drLim', 10000], ['crInc', 'hold'], ['crInc', 'hedge'], ['crPop', 1], ['crOut', 0]].forEach(([n, v]) => add('named.' + n + '=' + v, 'named', {[n]: v}, ROWS3));
    /* readings item 6 names that are already single readings: the velocity drift (prBd 0.132), bargaining pass-through 0.10 (bgPi), conv none (lfConv) */
    [['prBd', 0.132], ['bgPi', 0.1], ['lfConv', 'none']].forEach(([n, v]) => add('named.' + n + '=' + v, 'named', {[n]: v}, ROWS3));
    for (let s = 1; s <= 10; s++) add('fix.' + s*10, 'fixed', {}, PROG, 'fix=' + s/10);
  }
  return {points: pts, pairs, bound, single};
}
function applyMod(c, prog, mod) { if (!mod) return; const [m, v] = mod.split('='); MODS[m](c, prog, v === undefined ? undefined : +v); }
/* one row of one point */
function build(H, P, block, pt, row) {
  const prog = row !== 'none', c = H.r2FreezePair(P, row === 'rel' ? 'rel' : 'c22')[prog ? 1 : 0];
  if (block === 'F') { delete c.wt; c.gv = {}; if (prog) c.o = Object.assign({}, c.o, {a: 0}); }
  const x = Object.assign(mainOf(H, block, row), pt.x);
  IN[block].forEach(inp => inp[4](c, x[inp[0]], prog, H));
  if (c.wt && c.wt.aShift !== undefined) { c.wt.a = H.WT_CUTS[c.wt.cut || 'main'].a + c.wt.aShift; delete c.wt.aShift; }
  if (block === 'F' && prog) { const fin = c._fin, u = c._capU; c.o = Object.assign({}, c.o, {fin: 'tax'}); c.fx.fin = fin; if (fin === 'cap') c.gv.capHi = 0.95 + 0.04*u; else c.o.tauMax = 0.5 + 0.4*u; }
  delete c._fin; delete c._capU;
  applyMod(c, prog, pt.mod);
  return c;
}
/* the untouched main rows (part M, part B, selftest): [name, cfg] */
function mainRows(H, P) {
  const M = H.r2FreezePair(P, 'c22'), R = H.r2FreezePair(P, 'rel')[1];
  const fin = (c, prog, base) => { delete c.wt; c.gv = prog ? {sh: 1, base} : {}; if (prog) { c.o = Object.assign({}, c.o, {a: 0, fin: 'tax', tauMax: 0.9}); c.fx.fin = 'debt'; } return c; };
  const F = H.r2FreezePair(P, 'c22'), FR = H.r2FreezePair(P, 'rel')[1];
  return [['none', M[0]], ['c22', M[1]], ['rel', R], ['Fnone', fin(F[0], false)], ['Fc22', fin(F[1], true, 'all')], ['Frel', fin(FR, true, 'w')]];
}
const r7 = x => Number.isFinite(x) ? +x.toPrecision(DIGITS) : null, full = x => Number.isFinite(x) ? x : null;
function values(s, T, all) {
  const v = {};
  if (all) { Object.keys(s).forEach(k => { v[k] = Array.from(s[k], full); }); return v; }
  KEYS.forEach(k => { if (s[k]) v[k] = Array.from(s[k], r7); });
  const avg = p => s[p + '_1'] ? Array.from(s[p + '_1']).map((_, j) => { let a = 0; for (let t = 1; t < T; t++) a += s[p + '_' + t][j]; return r7(a/(T - 1)); }) : undefined;
  v.ppovA = avg('ppov'); v.pmedWA = avg('pmedW');
  /* the yearly series' index t holds the reading at the end of year t + 1 (the 20-year run's pov is its ppov_19), so year 20 of a 40-year run is _19 */
  if (T > 20) { if (s.ppov_19) v.ppov20 = Array.from(s.ppov_19, r7); if (s.pmedW_19) v.pmedW20 = Array.from(s.pmedW_19, r7); }
  return v;
}

/* ---- --check: the design against the preregistration (prereg Design and Amendment 1) ---- */
const PREREG = {S: {single: 32, pairs: 28, bound: 10, backing: 6, a0price: 5, named: 18, fixed: 10}, F: {single: 49, pairs: 66, bound: 10}};
if (process.argv.includes('--check')) {
  let ok = true, runs = 0;
  ['S', 'F'].forEach(block => {
    const D = design(block), n = {}; D.points.forEach(p => { n[p.kind] = (n[p.kind] || 0) + 1; p.alias.forEach(a => { const k = a.split('.')[0]; if (k === 'single' || k === 'named' || k === 'bound') n['_' + k] = (n['_' + k] || 0) + 1; }); });
    const singles = Object.keys(D.single).length, named = (n.named || 0) + D.points.filter(p => p.alias.some(a => a.startsWith('named.'))).length;
    const rr = D.points.reduce((s, p) => s + p.rows.length, 0); runs += rr;
    const want = PREREG[block], got = {single: singles, pairs: D.pairs.length, bound: Object.values(D.bound).reduce((s, o) => s + Object.keys(o).length, 0)};
    if (block === 'S') Object.assign(got, {backing: n.backing || 0, a0price: n.a0price || 0, named, fixed: n.fixed || 0});
    const bad = Object.keys(want).filter(k => want[k] !== got[k]); if (bad.length) ok = false;
    console.log('block ' + block + ': ' + D.points.length + ' distinct points, ' + rr + ' row-runs per environment, seed and horizon; ' + Object.keys(want).map(k => k + ' ' + got[k] + (want[k] === got[k] ? '' : ' (prereg ' + want[k] + ')')).join(', '));
    console.log('  carried: ' + ENDS.carried[block].map(([nm, rl, rd]) => nm + (rl === 'one' ? '@' + show(rd) : '')).join(' '));
    console.log('  pairs (ends; COND readings shown with the base point):');
    D.pairs.forEach(q => console.log('    ' + q.pair + ': ' + Object.entries(q.ends).map(([k, v]) => k + '=' + show(v)).join(', ') + (Object.keys(D.points[q.points.base].x).length ? '  [base ' + JSON.stringify(D.points[q.points.base].x) + ']' : '')));
    console.log('  bound (least-favourable ends):');
    Object.keys(D.bound).forEach(d => Object.keys(D.bound[d]).forEach(k => console.log('    ' + d + ' ' + k + ': ' + (Object.entries(D.points[D.bound[d][k]].x).map(([a, v]) => a + '=' + show(v)).join(' ') || 'main'))));
    console.log('  every point: ' + D.points.map(p => p.p + ' ' + p.id + (p.alias.length ? ' (= ' + p.alias.join(', ') + ')' : '') + ' [' + p.rows.join(',') + ']').join('; '));
  });
  const mb = 6 + 3;
  console.log('parts M and B: 6 and 3 row-runs (B at 10,000 adults). Parts S and F together: ' + runs + ' row-runs per environment, seed and horizon (prereg costing: about 685, M and B apart).');
  console.log(ok ? 'PASS  the design matches the preregistration (Amendment 1 counts)' : 'FAIL  the design differs from the preregistration'); process.exit(ok ? 0 : 1);
}

/* ---- --selftest (Reference, 500 adults): (1) every setter at the main reading reproduces the untouched main rows on every key (parts S and F);
 * (2) the 20-year run equals the first 20 years of the 40-year run (main pair, seed 1); (3) every point of S and F runs at 3 years, seed 1, finite. ---- */
if (process.argv.includes('--selftest')) {
  const H = require(path.join(process.cwd(), 'harness.js')), svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G); let fail = 0;
  try {
    const P = Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 500}), MR = mainRows(H, P);
    [['S', [0, 1, 2]], ['F', [3, 4, 5]]].forEach(([block, ix]) => {
      const D = design(block), pt = D.points[0], A = H.tbStudy(ix.map(i => MR[i][1]), 2, P, H.r2MainStudy()), B = H.tbStudy(ROWS3.map(r => build(H, P, block, pt, r)), 2, P, H.r2MainStudy());
      let worst = 0, wk = '', nk = 0;
      A.forEach((ra, i) => Object.keys(ra._s).forEach(key => { if (/^pr[A-Z]/.test(key)) return; const a = ra._s[key], b = B[i]._s[key]; if (!a || !b || !a.length) return; nk++;
        for (let j = 0; j < a.length; j++) { const d = a[j] === b[j] || (isNaN(a[j]) && isNaN(b[j])) ? 0 : Math.abs(a[j] - b[j])/Math.max(1, Math.abs(a[j])); if (!(d <= worst)) { worst = isNaN(d) ? Infinity : d; wk = ROWS3[i] + '.' + key; } } }));
      if (!(worst <= 1e-9)) fail++;
      console.log((worst <= 1e-9 ? 'PASS' : 'FAIL') + '  block ' + block + ': setters at main against the untouched main rows, ' + nk + ' series, seeds 1-2: largest relative difference ' + worst.toExponential(2) + (wk ? ' (' + wk + ')' : ''));
    });
    const P40 = Object.assign({}, P, {years: 40}), R20 = H.tbStudy(MR.slice(0, 2).map(x => x[1]), 1, P, H.r2MainStudy()), R40 = H.tbStudy(mainRows(H, P40).slice(0, 2).map(x => x[1]), 1, P40, H.r2MainStudy());
    const hz = [0, 1].map(i => [R20[i]._s.pov[0], R40[i]._s.ppov_19[0], R20[i]._s.medWealthReal[0], R40[i]._s.pmedW_19[0]]);
    const yk = [0, 1].map(i => Object.keys(R20[i]._s).filter(k => /_\d+$/.test(k) && +k.split('_').pop() < 20 && R40[i]._s[k]).filter(k => R20[i]._s[k][0] !== R40[i]._s[k][0]).length);
    const hok = hz.every(h => h[0] === h[1] && h[2] === h[3]) && yk.every(n => n === 0);
    if (!hok) fail++;
    console.log((hok ? 'PASS' : 'FAIL') + '  horizons: the 20-year run against the first 20 years of the 40-year run (no programme, C2.2, seed 1): year-20 wealth poverty and median real wealth ' + hz.map(h => h.map(v => +v.toPrecision(8)).join(' / ')).join('; ') + '; yearly readings of years 1-20 that differ: ' + yk.join(', '));
    const P3 = Object.assign({}, P, {years: 3}), t0 = Date.now();
    ['S', 'F'].forEach(block => { const D = design(block); let bad = [], n = 0;
      D.points.forEach(pt => { try { const R = H.tbStudy(pt.rows.map(r => build(H, P3, block, pt, r)), 1, P3, H.r2MainStudy()); n += pt.rows.length;
        R.forEach((r, i) => { const nf = KEYS.filter(k => r._s[k] && !Number.isFinite(r._s[k][0])); if (nf.length) bad.push(pt.id + '.' + pt.rows[i] + ': ' + nf.join(',')); }); }
        catch (e) { bad.push(pt.id + ': threw ' + e.message); } });
      if (bad.length) fail++;
      console.log((bad.length ? 'FAIL' : 'PASS') + '  block ' + block + ': every point runs (3 years, seed 1): ' + n + ' row-runs' + (bad.length ? '; ' + bad.slice(0, 12).join(' | ') : ''));
    });
    console.log('  (' + ((Date.now() - t0)/1000).toFixed(0) + ' s)');
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  process.exit(fail ? 1 : 0);
}

/* ---- the dry run (prereg "Before the first run", item 3): --part=all runs every part in every environment at both horizons, one after another, each with
 * --procs, and writes one file: rows named <part>.<years>.<env>.<point>.<row>, and _meta.timings, one entry per part, environment and horizon. ---- */
if (arg('part', '') === 'all') {
  const cp = require('child_process'), mm = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), k = +arg('procs', 1), t0 = Date.now();
  if (!mm || !out) { console.error('usage: r2.js --part=all --seeds=A-B --out=FILE [--procs=K]'); process.exit(1); }
  const res = {_meta: null, rows: {}}, timings = [];
  ['M', 'S', 'F', 'B'].forEach(pt => ['ref', 'adv', 'str'].forEach(e => [20, 40].forEach(y => {
    const f = out.replace(/\.json$/, '') + '.' + pt + '-' + e + '-' + y + '.json';
    const r = cp.spawnSync(process.execPath, [__filename, '--part=' + pt, '--env=' + e, '--years=' + y, '--seeds=' + mm[1] + '-' + mm[2], '--out=' + f, '--procs=' + k], {stdio: 'inherit'});
    if (r.status !== 0) { console.error('part ' + pt + ' ' + e + ' ' + y + ' exited ' + r.status); process.exit(1); }
    const d = JSON.parse(fs.readFileSync(f, 'utf8')), t = JSON.parse(fs.readFileSync(f.replace(/\.json$/, '') + '.timing.json', 'utf8'));
    if (!res._meta) res._meta = Object.assign({}, d._meta, {what: 'S63 round-2 dry run: every part, environment and horizon', part: 'all', env: 'all', years: 'both', points: null, design: undefined, keys: undefined,
      command: 'node runner/jobs/r2.js --part=all --seeds=' + mm[1] + '-' + mm[2] + ' --procs=' + k});
    Object.keys(d.rows).forEach(n => { res.rows[pt + '.' + y + '.' + n] = d.rows[n]; });
    timings.push(Object.assign({part: pt, env: e, years: y}, t)); fs.unlinkSync(f); fs.unlinkSync(f.replace(/\.json$/, '') + '.timing.json'); })));
  res._meta.timings = timings.map(t => ({part: t.part, env: t.env, years: t.years, adults: t.adults, units: t.units, seconds: t.seconds, rowSeconds: t.rowSeconds}));
  fs.writeFileSync(out, JSON.stringify(res));
  const secs = (Date.now() - t0)/1000, n = +mm[2] - +mm[1] + 1;
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({part: 'all', seeds: n, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(2), peakRssMB: Math.max(...timings.map(t => t.peakRssMB)), node: process.version}));
  console.error('r2 dry run seeds ' + mm[1] + '-' + mm[2] + ': ' + secs.toFixed(1) + ' s');
  process.exit(0);
}

/* ---- a run ---- */
const part = arg('part', ''), env = arg('env', ''), years = +arg('years', 0), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
if (!['M', 'S', 'F', 'B'].includes(part) || !ENVN[env] || ![20, 40].includes(years) || !m || !out || !Number.isInteger(procs) || procs < 1) {
  console.error('usage: r2.js --part=M|S|F|B --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--points=A-B]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now(), adults = part === 'B' ? 10000 : 500;
const D = part === 'S' || part === 'F' ? design(part) : null, UNITS = D ? D.points.length : part === 'M' ? 6 : 3;
const pm = /^(\d+)-(\d+)$/.exec(arg('points', '0-' + (UNITS - 1))), p0 = +pm[1], p1 = Math.min(UNITS - 1, +pm[2]);
const pass = process.argv.filter(x => /^--(part|env|years|seeds)=/.test(x));
const cmd = 'node runner/jobs/r2.js --part=' + part + ' --env=' + env + ' --years=' + years + ' --seeds=' + lo + '-' + hi;
if (procs > 1 && p1 > p0) {
  const cp = require('child_process'), n0 = p1 - p0 + 1, k = Math.min(procs, n0), parts = []; let s0 = p0;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename].concat(pass, ['--points=' + q.from + '-' + q.to, '--out=' + q.file]), {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const Dp = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o2 = Dp[0], rows = {};
    Dp.forEach(d => Object.keys(d.rows).forEach(n => { rows[n] = d.rows[n]; }));
    const names = Object.keys(rows).sort(), sorted = {}; names.forEach(n => { sorted[n] = rows[n]; });
    o2.rows = sorted; o2._meta.points = [p0, p1]; if (D) o2._meta.design = D.points.slice(p0, p1 + 1); o2._meta.command = cmd + (p0 === 0 && p1 === UNITS - 1 ? '' : ' --points=' + p0 + '-' + p1);
    fs.writeFileSync(out, JSON.stringify(o2));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000;
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({part, env, years, adults, seeds: hi - lo + 1, units: p1 - p0 + 1, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(2),
      rowSeconds: T.map(t => t.rowSeconds), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error('r2 part ' + part + ' ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = require(path.join(process.cwd(), 'harness.js')), svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  const res = {_meta: {what: 'S63 round-2 batch (research-update prereg/2026-11-s63-round2-freeze.md), part ' + part + ': per-seed values of each key, every row of each point',
    part, env, years, adults, seeds: [lo, hi], points: [p0, p1], keys: part === 'S' || part === 'F' ? KEYS.concat(['ppovA', 'pmedWA'], years > 20 ? ['ppov20', 'pmedW20'] : []) : 'all', digits: D ? DIGITS : 'full',
    manifest: H.runManifest(), command: cmd + (p0 === 0 && p1 === UNITS - 1 ? '' : ' --points=' + p0 + '-' + p1)}, rows: {}};
  const tRow = [];
  try {
    const P = Object.assign({}, H[ENVN[env]], {years, nAgents: adults});
    if (D) {
      res._meta.design = D.points.slice(p0, p1 + 1);
      for (let p = p0; p <= p1; p++) { const pt = D.points[p], t1 = Date.now();
        const R = H.tbStudy(pt.rows.map(r => build(H, P, part, pt, r)), hi, P, H.r2MainStudy(), lo);
        pt.rows.forEach((r, i) => { res.rows[env + '.p' + String(p).padStart(4, '0') + '.' + r] = values(R[i]._s, years, false); });
        tRow.push(+((Date.now() - t1)/1000/pt.rows.length/(hi - lo + 1)).toFixed(3)); }
    } else {
      const MR = mainRows(H, P), list = part === 'M' ? MR : MR.slice(0, 3);
      for (let p = p0; p <= p1; p++) { const t1 = Date.now(), R = H.tbStudy([list[p][1]], hi, P, H.r2MainStudy(), lo);
        res.rows[env + '.' + list[p][0]] = values(R[0]._s, years, true); tRow.push(+((Date.now() - t1)/1000/(hi - lo + 1)).toFixed(3)); }
    }
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  const sorted = {}; Object.keys(res.rows).sort().forEach(n => { sorted[n] = res.rows[n]; }); res.rows = sorted;  /* the same bytes with or without --procs */
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(res));
  const secs = (Date.now() - t0)/1000, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({part, env, years, adults, seeds: hi - lo + 1, units: p1 - p0 + 1, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(2), rowSeconds: tRow, peakRssMB: rss, node: process.version}));
  console.error('r2 part ' + part + ' ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ' units ' + p0 + '-' + p1 + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
