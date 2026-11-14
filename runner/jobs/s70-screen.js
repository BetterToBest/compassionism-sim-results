#!/usr/bin/env node
/* S70 (Nov 14, 2026): the screen of round 2's assumptions, as preregistered in research-update prereg/2026-11-s70-screen.md. Every swept reading of
 * round 2 is varied together (Morris elementary effects: Morris 1991; Campolongo, Cariboni and Saltelli 2007) around the candidate main row
 * (harness.js r2MainRow, r2MainPair, r2MainStudy), 500 adults, 20 years, Reference and Adverse. The engine is not changed: every reading is a row option.
 *
 * Two blocks:
 *   S  the Source rows. Inputs IN_S (33). Five rows per design point: the no-programme run, the C2.2 design and the release design at full backing
 *      (o.a 1: Duke's decision of Nov 14, the main row), and both designs at no assumed backing (o.a 0: only the output the model sees sold backs the
 *      payout; the low end of the backing curve). The backed share itself is not an input (PLAN S70: S63 carries it as its own curve).
 *   F  the financed rows (S72; D23): the C2.2 design and the release design paid for by a contribution (o.fin 'tax'), the rest met as fx.fin says.
 *      Inputs IN_F (41): IN_S without the weighted tail's three (block F runs without the tail, S72 Amendment 2: the bases 'wc' and 'all' are not read
 *      with the tail on) plus the financing readings. Three rows per point: the no-programme run and the two financed designs.
 * Every input is applied to both runs of a pair (r2MainRow's convention); the financing options of the programme run only (as S72's pilot).
 *
 * Design (fixed by the preregistration): R = 12 trajectories per block, a 4-level grid on each input's range, step 2/3 of the range; the start of each
 * trajectory on the lower half of the grid; the inputs moved one at a time in a random order. Generator mulberry32-style, seeds 70001 (S) and 70002 (F).
 * Continuous inputs: lo + u (hi - lo). Categorical inputs, main reading first: two levels read u < 1/2 as the first and the rest as the second (every
 * step switches); three levels read the grid's levels 0, 1, 2, 3 as A, B, B, C (a step goes A to B or B to C). Integer inputs are rounded.
 *
 * Output: per row, one value per seed of each key in KEYS (ppovA is the yearly average of wealth poverty over years 1-19, from ppov_1..ppov_19).
 * Rows are named ENV.pNNNN.ROW (NNNN the design point, 0-based). _meta.design holds every point's grid values u and the readings they map to.
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/s70-screen.js --block=S|F --env=ref|adv|both --seeds=A-B --out=FILE [--procs=K] [--points=A-B]
 *   node RESULTS/runner/jobs/s70-screen.js --block=S|F --check      (the design's size against the preregistration; no output)
 * --procs=K cuts the design points into K pieces run as K processes and joins them (the same bytes as one process). --points runs a subset (tests only).
 * FILE holds only deterministic content; seconds and memory go to stderr and FILE without .json plus .timing.json. */
'use strict';
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const KEYS = ['bNAPy', 'fgt0PY', 'ppovA', 'pov', 'wtMedE', 'endoAnn', 'cost', 'tauMean', 'gvDebtY', 'gvY100'];
const R_TRAJ = 12, PREREG = {S: {k: 33, points: 12*34, rows: 5}, F: {k: 41, points: 12*42, rows: 3}};

/* [name, kind, spec, what, set(c, v, prog)]: kind 'c' continuous [lo, hi]; 'i' integer [lo, hi]; 'k' categorical [main, ...]. */
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

function rng(seed) { let s = seed >>> 0; return () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0)/4294967296; }; }
function design(block) {
  const I = IN[block], k = I.length, p = 4, D = p/(2*(p - 1)), r = rng(block === 'S' ? 70001 : 70002), pts = [];
  for (let t = 0; t < R_TRAJ; t++) {
    let u = I.map(() => Math.floor(r()*(p/2))/(p - 1)); pts.push({t, moved: null, u: u.slice()});
    const ord = I.map((_, i) => i).sort(() => r() - 0.5);
    for (const i of ord) { u = u.slice(); u[i] = u[i] + D; pts.push({t, moved: I[i][0], u: u.slice()}); }
  }
  return pts;
}
const level = u => Math.round(u*3);
function value(inp, u) {
  const [, kind, s] = inp;
  if (kind === 'c') return s[0] + u*(s[1] - s[0]);
  if (kind === 'i') return Math.round(s[0] + u*(s[1] - s[0]));
  if (s.length === 2) return u < 0.5 ? s[0] : s[1];
  return s[[0, 1, 1, 2][level(u)]];
}
/* One design point's rows: [name, cfg]. */
function pointRows(H, P, block, pt) {
  const I = IN[block], vals = I.map((inp, i) => value(inp, pt.u[i]));
  const mk = (d, prog) => {
    const c = H.r2MainPair(P, d)[prog ? 1 : 0];
    if (block === 'F') { delete c.wt; c.gv = {}; }
    I.forEach((inp, i) => inp[4](c, vals[i], prog, H));
    if (c.wt && c.wt.aShift !== undefined) { const cut = H.WT_CUTS ? H.WT_CUTS[c.wt.cut || 'main'] : null; if (!cut) throw new Error('WT_CUTS not exported'); c.wt.a = cut.a + c.wt.aShift; delete c.wt.aShift; }
    if (block === 'F' && prog) {
      const fin = c._fin, u = c._capU; delete c._fin; delete c._capU;
      c.o = Object.assign({}, c.o, {fin: 'tax'}); c.fx.fin = fin;
      if (fin === 'cap') c.gv.capHi = 0.95 + 0.04*u; else c.o.tauMax = 0.5 + 0.4*u;
    } else { delete c._fin; delete c._capU; }
    return c;
  };
  if (block === 'S') {
    const full = c => { c.o = Object.assign({}, c.o, {a: 1}); return c; }, none0 = c => { c.o = Object.assign({}, c.o, {a: 0}); return c; };
    return [['none', mk('c22', false)], ['c22', full(mk('c22', true))], ['rel', full(mk('rel', true))], ['c22a0', none0(mk('c22', true))], ['rela0', none0(mk('rel', true))]];
  }
  return [['none', mk('c22', false)], ['c22', mk('c22', true)], ['rel', mk('rel', true)]];
}
function readings(block, pt) { const I = IN[block]; const o2 = {}; I.forEach((inp, i) => { o2[inp[0]] = value(inp, pt.u[i]); }); return o2; }

const block = arg('block', ''), check = process.argv.includes('--check');
if (!IN[block]) { console.error('usage: s70-screen.js --block=S|F ...'); process.exit(1); }
if (check) {
  const pts = design(block), I = IN[block], P = PREREG[block], names = new Set(I.map(x => x[0]));
  const moves = {}; pts.forEach(p => { if (p.moved) moves[p.moved] = (moves[p.moved] || 0) + 1; });
  const inRange = pts.every(p => p.u.every(u => u >= -1e-12 && u <= 1 + 1e-12));
  const ok = I.length === P.k && names.size === I.length && pts.length === P.points && inRange && I.every(x => moves[x[0]] === R_TRAJ);
  console.log((ok ? 'PASS' : 'FAIL') + '  block ' + block + ': inputs ' + I.length + ' (prereg ' + P.k + '), points ' + pts.length + ' (prereg ' + P.points + '), each input moved ' + R_TRAJ + ' times: ' + I.every(x => moves[x[0]] === R_TRAJ) + ', grid in range: ' + inRange);
  process.exit(ok ? 0 : 1);
}
/* --selftest (Reference, seeds 1-2): (1) every setter at the main row's reading (the price rule at today's corner) gives the untouched main pair on
 * every key; (2) the grid's two corners (every u 0, every u 1) run without error. Prints the largest difference; exits 1 if (1) differs by over 1e-9. */
if (process.argv.includes('--selftest')) {
  const H = require(path.join(process.cwd(), 'harness.js')), svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  try {
    const P = Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 500}), I = IN[block];
    const MAIN = {prK: 1, prR: 0, prA: 0, prH: 0, prRs: false, prBd: 0, sc: H.SPEND_FROZEN, wIdx: 1, rho: H.LABOR_DEFAULTS.rho, paDem: 0.49, drLim: 2500, lfConv: 'keep', lfFl: 'stock', lfPm: 0.43,
      rtPhi: 0.46, rtNs: 'nom', rtIx: 1, rtChi: 0, bgPi: 0, bgM: 1/1.21, poCost: 'full', poRes: 0.017, poW: 0.20, poTest: 'sales', poHire: null, poBonus: 'workers', poPay: 'source',
      crInc: 'pass', crOut: 1, crPop: 0, wtCut: 'main', wtA: 0, wtM: 3, gvSh: 1, gvBase: 'w', cap: 1, fin: 'debt', gvRr: 0.0097, gvDk: 0.04, gvR: 'fixed', gvA: 0.5, gvB: 0.5, gvRs: 0.0097, gvIp: 'tax'};
    const build = (d, prog, setAll) => { const c = H.r2MainPair(P, d)[prog ? 1 : 0];
      if (block === 'F') { delete c.wt; c.gv = {}; }
      if (setAll) { I.forEach(inp => inp[4](c, MAIN[inp[0]], prog, H)); if (c.wt && c.wt.aShift !== undefined) { c.wt.a = H.WT_CUTS[c.wt.cut || 'main'].a + c.wt.aShift; delete c.wt.aShift; } }
      if (block === 'F' && prog) { const fin = setAll ? c._fin : 'debt'; c.o = Object.assign({}, c.o, {fin: 'tax'}); c.fx.fin = fin; c.o.tauMax = 0.9; }
      delete c._fin; delete c._capU; c.o = Object.assign({}, c.o, prog && block === 'S' ? {a: 1} : {}); return c; };
    const rowsA = [build('c22', false, false), build('c22', true, false), build('rel', true, false)], rowsB = [build('c22', false, true), build('c22', true, true), build('rel', true, true)];
    const RA = H.tbStudy(rowsA, 2, P, H.r2MainStudy()), RB = H.tbStudy(rowsB, 2, P, H.r2MainStudy());
    let worst = 0, wk = '', nk = 0;
    RA.forEach((ra, i) => Object.keys(ra._s).forEach(key => { if (/^pr[A-Z]/.test(key)) return;  /* the price rule's own reporting keys (prOn and the rule's diagnostics) exist only with pr set */
      const a = ra._s[key], b = RB[i]._s[key]; if (!a || !b || !a.length) return; nk++;
      for (let j = 0; j < a.length; j++) { const d = Math.abs(a[j] - b[j]) / Math.max(1, Math.abs(a[j])); if (!(d <= worst)) { worst = isNaN(d) ? Infinity : d; wk = ['none', 'c22', 'rel'][i] + '.' + key; } } }));
    console.log('selftest block ' + block + ': setters at the main readings against the untouched main pair, ' + nk + ' series: largest relative difference ' + worst.toExponential(2) + ' (' + wk + ')');
    [0, 1].forEach(u => { const pt = {u: I.map(() => u)}; const L = pointRows(H, P, block, pt); const R = H.tbStudy(L.map(x => x[1]), 1, P, H.r2MainStudy());
      console.log('corner u=' + u + ': ' + L.map((x, i) => x[0] + ' basket ' + R[i]._s.fgt0PY[0].toFixed(2) + ' infl ' + (100*R[i]._s.endoAnn[0]).toFixed(2)).join('; ')); });
    /* (3) each input moved alone from the low corner (every u 0) to its top (u 1), seed 1: which rows' outputs change (an input that changes nothing
     * is listed: either it is inactive at that corner, as the policy-rate rule's coefficients under the fixed rate, or its setter is wrong). */
    const base = pointRows(H, P, block, {u: I.map(() => 0)}), RB0 = H.tbStudy(base.map(x => x[1]), 1, P, H.r2MainStudy()), still = [];
    I.forEach((inp, i) => { const u = I.map(() => 0); u[i] = 1; const L = pointRows(H, P, block, {u}), R = H.tbStudy(L.map(x => x[1]), 1, P, H.r2MainStudy());
      const moved = L.filter((x, r) => KEYS.some(key => key !== 'ppovA' && R[r]._s[key] && RB0[r]._s[key] && Math.abs(R[r]._s[key][0] - RB0[r]._s[key][0]) > 1e-12)).map(x => x[0]);
      if (!moved.length) still.push(inp[0]); console.log('  ' + inp[0] + ': moves ' + (moved.join(', ') || 'nothing')); });
    console.log('inputs that move nothing alone from the low corner: ' + (still.join(', ') || 'none'));
    process.exit(worst <= 1e-9 ? 0 : 1);
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
}
const env = arg('env', 'both'), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
const ENVS = env === 'both' ? ['ref', 'adv'] : [env];
const ALL = design(block), pm = /^(\d+)-(\d+)$/.exec(arg('points', '0-' + (ALL.length - 1))), p0 = +pm[1], p1 = Math.min(ALL.length - 1, +pm[2]);
if (!ENVS.every(e => ENVN[e]) || !m || !out || !Number.isInteger(procs) || procs < 1) { console.error('usage: s70-screen.js --block=S|F --env=ref|adv|both --seeds=A-B --out=FILE [--procs=1]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now();
const pass = process.argv.filter(x => /^--(block|env|seeds)=/.test(x));
if (procs > 1 && p1 > p0) {
  const cp = require('child_process'), n0 = p1 - p0 + 1, k = Math.min(procs, n0), parts = []; let s0 = p0;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename].concat(pass, ['--points=' + q.from + '-' + q.to, '--out=' + q.file]), {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const D = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o2 = D[0], rows = {}, own = D.map(x => x._meta.points.slice());  /* each piece's own points, read before o2's are rewritten */
    o2._meta.points = [p0, p1]; o2._meta.command = o2._meta.command.replace(/ --points=\d+-\d+/, '') + (p0 === 0 && p1 === ALL.length - 1 ? '' : ' --points=' + p0 + '-' + p1);
    ENVS.forEach(e => { for (let p = p0; p <= p1; p++) { const d = D[own.findIndex(q => q[0] <= p && p <= q[1])]; Object.keys(d.rows).filter(n => n.startsWith(e + '.p' + String(p).padStart(4, '0') + '.')).forEach(n => { rows[n] = d.rows[n]; }); } });
    o2.rows = rows; o2._meta.design = ALL.slice(p0, p1 + 1).map((pt, j) => Object.assign({p: p0 + j}, pt, {x: readings(block, pt)}));
    fs.writeFileSync(out, JSON.stringify(o2));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000, n = hi - lo + 1;
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({block, env, seeds: n, points: p1 - p0 + 1, procs: k, seconds: +secs.toFixed(2), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error('block ' + block + ' ' + env + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = require(path.join(process.cwd(), 'harness.js'));
  const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  const res = {_meta: {what: 'S70 screen of round 2 (prereg/2026-11-s70-screen.md), block ' + block + ': per-seed values of each key at each design point', block, env, seeds: [lo, hi], points: [p0, p1],
    adults: 500, years: 20, trajectories: R_TRAJ, keys: KEYS, inputs: IN[block].map(x => ({name: x[0], kind: x[1], spec: x[2], what: x[3]})), manifest: H.runManifest(),
    command: 'node runner/jobs/s70-screen.js --block=' + block + ' --env=' + env + ' --seeds=' + lo + '-' + hi + (p0 === 0 && p1 === ALL.length - 1 ? '' : ' --points=' + p0 + '-' + p1)}, rows: {}};
  try {
    ENVS.forEach(e => {
      const P = Object.assign({}, H[ENVN[e]], {years: 20, nAgents: 500});
      for (let p = p0; p <= p1; p++) {
        const L = pointRows(H, P, block, ALL[p]), R = H.tbStudy(L.map(x => x[1]), hi, P, H.r2MainStudy(), lo);
        L.forEach((x, i) => { const v = {}, s = R[i]._s;
          KEYS.forEach(key => { if (key === 'ppovA') { if (s.ppov_1) v.ppovA = Array.from(s.ppov_1).map((_, j) => { let a = 0; for (let t = 1; t < 20; t++) a += s['ppov_' + t][j]; return a/19; }); } else if (s[key]) v[key] = Array.from(s[key]); });
          res.rows[e + '.p' + String(p).padStart(4, '0') + '.' + x[0]] = v; });
      }
    });
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  res._meta.design = ALL.slice(p0, p1 + 1).map((pt, j) => Object.assign({p: p0 + j}, pt, {x: readings(block, pt)}));
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(res));
  const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({block, env, seeds: n, points: p1 - p0 + 1, seconds: +secs.toFixed(2), peakRssMB: rss, node: process.version}));
  console.error('block ' + block + ' ' + env + ' seeds ' + lo + '-' + hi + ' points ' + p0 + '-' + p1 + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
