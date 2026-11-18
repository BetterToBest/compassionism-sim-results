#!/usr/bin/env node
/* S82 part 2 (Nov 17, 2026): the v6 batch of the Compassionism Simulation, as preregistered in research-update prereg/2026-11-s82-v6-supply-indexing.md
 * (with its Amendments 1-4). Every reading is a row option of the pinned engine; this script changes no engine line.
 *
 * The pair: harness.js r2FreezePair (the frozen round-2 main row, C2.2 design, full coverage, today's price rule), the programme run at backed share a.
 * Rows per environment and horizon (prereg Design table; the two fs rows dropped by Amendment 2; Amendment 3's strict-bound sweep and Amendment 4's price-response sweep added: 231 rows):
 *   base   the no-programme run; the programme run at a = 0, 0.25, 0.5, 0.75, 1                                                   6
 *   A      the supply limit (price option sl): readings sourced, restricted, strict x rules pay, even, bu x a = 0-0.75           36
 *   Achk   sl full at a = 0 (must equal base a = 0); sl strict with each rule at a = 1 (must equal base a = 1)                      4
 *   B      wages (wIdx 0.5, 0.75 x wc 0, 1, both runs): the no-programme run and a = 0-1                                           24
 *   C      the BU's delay (bl 0.125, 0.25, 1, 2; programme run): a = 0-1                                                          20
 *   X      the factorial at the central readings (A sourced with pay or bu; B wIdx 0.75, wc 1; C bl 1): AB, AC, ABC with each
 *          rule and BC at a = 0-0.75, and BC at a = 1                                                                            29
 *   E      the smaller readings, each its own pair at a = 0 and 1 with its no-programme run: the wage-only spending share 0.862
 *          (sc), the tail exponent at minus and plus two standard errors (1.218, 1.762), the tail cut at the 95th percentile,
 *          the PTH equity base from the basket (fx.eb), ageing (ag {} with lf.fl 'panel')                                        18
 *   Slam   Amendment 3: the building speed of medical care and food (sl.lam 0, 0.1, 0.5, 1; the sourced row's 0.25) with every other
 *          value sourced x rules pay, even, bu x a = 0-0.75; at lam 0 medical care and food are at the strict bound              48
 *   Sgrid  Amendment 3: the strict bound at a = 0.125, 0.375, 0.625, 0.875 x rules pay, even, bu (the finer backing grid)          12
 *   Th     Amendment 4: the essentials price response theta at half (housing 0.3, medical 0.25) and double (1.2, 1.0) the engine's own, food 0;
 *          at each: the programme run at a = 0-1, and sl sourced x rules pay, even, bu x a = 0-0.75 (the no-programme run is shared)  34
 * The rows of Amendments 3 and 4 come after row 136, so rows 0-136 keep their numbers. Every run has the study option s82 (section D's reporting keys).
 * Outputs (per seed, 7 significant digits): KEYS, the derived yearly averages ppovA and pmedWA (and ppov20, pmedW20 at 40 years), and every key the
 * engine reports with the prefix sl or s82 (the limit's and the study's reporting keys). One results folder per environment and horizon:
 * s82-v6-<env>-<years>-<engine 7>.
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/s82.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]
 *   node RESULTS/runner/jobs/s82.js --dry --seeds=A-B --out=FILE [--procs=K]   (every environment and horizon in one file: timings)
 *   node RESULTS/runner/jobs/s82.js --check       (the design against the preregistration's counts; prints every row)
 *   node RESULTS/runner/jobs/s82.js --selftest    (checks 1-8 of the preregistration, Reference, 500 adults, 20 years, seeds 1-2)
 * Every run first passes the release start's baseline check (startRelease, check 8) and records the effective settings (_settings).
 * FILE holds only deterministic content; seconds and memory go to stderr and to FILE without .json plus .timing.json. */
'use strict';
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', str: 'STRESS_TEST'}, BASE_ENV = {ref: 'ref', adv: 'adv', str: 'st'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const KEYS = ['fgt0PY', 'bNAPy', 'pov', 'wtMedE', 'medWealthReal', 'endoAnn', 'fgt1PY', 'fgt2PY', 'prSh', 'prWsh', 'prPovSh', 'prRat', 'prRatE', 'cost', 'tauMean',
  'emp', 'hrs', 'buPY', 'wtPovE', 'wtF0E', 'wtTailW', 'wyF0PY', 'lfPart', 'lfOut', 'dmLsPY', 'dmWt1E', 'dmWt10E', 'dmYpE', 'dmWrE', 'mfUY', 'c22PY'];
const OWN = /^(sl|s82)[A-Z]/, DIGITS = 7;
const SHARES = [0, 0.25, 0.5, 0.75, 1], LOW = [0, 0.25, 0.5, 0.75], RD = ['sourced', 'restricted', 'strict'], SH = ['pay', 'even', 'bu'];
const WI = [0.5, 0.75], WC = [0, 1], LAGS = [0.125, 0.25, 1, 2], CEN = {w: 0.75, wc: 1, L: 1};
const TAIL = {a: 1.4901, se: 0.136};  /* WT_CUTS.main; the prereg's readings 1.490 -/+ 2 x 0.136 = 1.218, 1.762 */
const EREAD = ['sc', 'tailLo', 'tailHi', 'p95', 'eb', 'age'];
const PREREG = {base: 6, A: 36, Achk: 4, B: 24, C: 20, X: 29, E: 18, Slam: 48, Sgrid: 12, Th: 34};  /* Design table, less the two fs rows (Amendment 2), plus the strict-bound sweep (Amendment 3) and the price-response sweep (Amendment 4) */
const LAMS = [0, 0.1, 0.5, 1], FINE = [0.125, 0.375, 0.625, 0.875], NROWS = 231;
const THETAS = [['half', {housing: 0.3, medical: 0.25}], ['double', {housing: 1.2, medical: 1.0}]];  /* PM_DEFAULTS.theta: food 0, housing 0.6, medical 0.5 */
const study = H => Object.assign(H.r2MainStudy(), {s82: true});  /* section D's reporting keys (engine v5.9.18) */

/* the rows: {name, part, prog, a, sl, w, wc, L, e} */
function design() {
  const R = [], add = (part, name, x) => R.push(Object.assign({part, name: part + '.' + name, prog: true, a: null, sl: null, w: null, wc: null, L: null, e: null, th: null}, x));
  add('base', 'none', {prog: false}); SHARES.forEach(a => add('base', 'a' + a, {a}));
  RD.forEach(rd => SH.forEach(sh => LOW.forEach(a => add('A', rd + '.' + sh + '.a' + a, {a, sl: {rd, sh}}))));
  add('Achk', 'full.a0', {a: 0, sl: {rd: 'full', sh: 'pay'}}); SH.forEach(sh => add('Achk', 'strict.' + sh + '.a1', {a: 1, sl: {rd: 'strict', sh}}));
  WI.forEach(w => WC.forEach(wc => { add('B', 'w' + w + '.c' + wc + '.none', {prog: false, w, wc}); SHARES.forEach(a => add('B', 'w' + w + '.c' + wc + '.a' + a, {a, w, wc})); }));
  LAGS.forEach(L => SHARES.forEach(a => add('C', 'L' + L + '.a' + a, {a, L})));
  LOW.forEach(a => {
    ['pay', 'bu'].forEach(sh => { const sl = {rd: 'sourced', sh};
      add('X', 'AB.' + sh + '.a' + a, {a, sl, w: CEN.w, wc: CEN.wc}); add('X', 'AC.' + sh + '.a' + a, {a, sl, L: CEN.L}); add('X', 'ABC.' + sh + '.a' + a, {a, sl, w: CEN.w, wc: CEN.wc, L: CEN.L}); });
    add('X', 'BC.a' + a, {a, w: CEN.w, wc: CEN.wc, L: CEN.L}); });
  add('X', 'BC.a1', {a: 1, w: CEN.w, wc: CEN.wc, L: CEN.L});
  EREAD.forEach(e => { add('E', e + '.none', {prog: false, e}); [0, 1].forEach(a => add('E', e + '.a' + a, {a, e})); });
  LAMS.forEach(l => SH.forEach(sh => LOW.forEach(a => add('Slam', 'lam' + l + '.' + sh + '.a' + a, {a, sl: {rd: 'sourced', sh, lam: {medical: l, food: l}}}))));
  FINE.forEach(a => SH.forEach(sh => add('Sgrid', 'strict.' + sh + '.a' + a, {a, sl: {rd: 'strict', sh}})));
  THETAS.forEach(([n, th]) => { SHARES.forEach(a => add('Th', n + '.base.a' + a, {a, th})); SH.forEach(sh => LOW.forEach(a => add('Th', n + '.sourced.' + sh + '.a' + a, {a, sl: {rd: 'sourced', sh}, th}))); });
  return R;
}
/* one row's configuration (r: a design row; extra: options added by the selftest) */
function build(H, P, r, extra) {
  const c = H.r2FreezePair(P, 'c22')[r.prog ? 1 : 0];
  c.o = Object.assign({}, c.o || {});
  if (r.prog) c.o.a = r.a;
  if (r.sl) { c.o.sl = Object.assign({}, r.sl); if (r.sl.lam) c.o.sl.lam = Object.assign({}, r.sl.lam); }
  if (r.w !== null) { c.o.wIdx = r.w; c.o.wc = r.wc; }
  if (r.L !== null) c.o.bl = r.L;
  if (r.th) c.o.theta = Object.assign({}, r.th);
  const wt = () => { c.wt = Object.assign({}, c.wt && typeof c.wt === 'object' ? c.wt : {}); return c.wt; };
  if (r.e === 'sc') c.sc = 0.862;
  else if (r.e === 'tailLo') wt().a = +(TAIL.a - 2*TAIL.se).toFixed(4);
  else if (r.e === 'tailHi') wt().a = +(TAIL.a + 2*TAIL.se).toFixed(4);
  else if (r.e === 'p95') wt().cut = 'p95';
  else if (r.e === 'eb') c.fx = Object.assign({}, c.fx, {eb: true});
  else if (r.e === 'age') { c.ag = {}; c.lf = Object.assign({}, c.lf || {}, {fl: 'panel'}); }
  if (extra) extra(c);
  return c;
}
const r7 = x => Number.isFinite(x) ? +x.toPrecision(DIGITS) : null;
function values(s, T) {
  const v = {};
  KEYS.forEach(k => { if (s[k]) v[k] = Array.from(s[k], r7); });
  Object.keys(s).filter(k => OWN.test(k) && !/_\d+$/.test(k)).sort().forEach(k => { v[k] = Array.from(s[k], r7); });
  const avg = p => s[p + '_1'] ? Array.from(s[p + '_1']).map((_, j) => { let a = 0; for (let t = 1; t < T; t++) a += s[p + '_' + t][j]; return r7(a/(T - 1)); }) : undefined;
  v.ppovA = avg('ppov'); v.pmedWA = avg('pmedW');
  /* the yearly series' index t holds the reading at the end of year t + 1, so year 20 of a 40-year run is _19 (as runner/jobs/r2.js) */
  if (T > 20) { if (s.ppov_19) v.ppov20 = Array.from(s.ppov_19, r7); if (s.pmedW_19) v.pmedW20 = Array.from(s.pmedW_19, r7); }
  return v;
}
const engine = () => require(path.join(process.cwd(), 'harness.js'));

/* ---- --check: the design against the preregistration ---- */
if (process.argv.includes('--check')) {
  const D = design(), n = {}; D.forEach(r => { n[r.part] = (n[r.part] || 0) + 1; });
  const names = new Set(D.map(r => r.name)), bad = Object.keys(PREREG).filter(k => PREREG[k] !== (n[k] || 0));
  Object.keys(PREREG).forEach(k => console.log(k + ': ' + (n[k] || 0) + ' rows' + (PREREG[k] === n[k] ? '' : ' (prereg ' + PREREG[k] + ')')));
  console.log('every row: ' + D.map((r, i) => i + ' ' + r.name).join('; '));
  const ok = !bad.length && names.size === D.length && D.length === NROWS;
  console.log(ok ? 'PASS  ' + D.length + ' rows, the preregistration\'s counts (Amendment 2: fs rows dropped; Amendments 3 and 4: the strict-bound and price-response sweeps)' : 'FAIL  the design differs from the preregistration');
  process.exit(ok ? 0 : 1);
}

/* ---- --selftest: the preregistration's checks 1-8 (Reference, 500 adults, 20 years, seeds 1-2) and every row runs (3 years, seed 1) ---- */
if (process.argv.includes('--selftest')) {
  const H = engine(); let fail = 0;
  const say = (ok, msg) => { if (!ok) fail++; console.log((ok ? 'PASS' : 'FAIL') + '  ' + msg); };
  const S = H.startRelease({baseline: {env: 'ref'}});
  say(S.baseline && S.baseline.checked, 'check 8: the release start\'s baseline check (no-programme arm equals the release, Reference, seeds 1-' + (S.baseline ? S.baseline.seeds : '?') + ', ' + (S.baseline ? S.baseline.values : 0) + ' values)');
  try {
    const P = Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 500}), D = design(), so = study(H), N = 2;
    const row = name => D.find(r => r.name === name), run = cfs => H.tbStudy(cfs, N, P, so);
    const diff = (A, B, skip) => Object.keys(Object.assign({}, A._s, B._s)).filter(k => !(skip && skip.test(k))).filter(k => { const a = A._s[k], b = B._s[k]; if (!a || !b || a.length !== b.length) return true;
      for (let j = 0; j < a.length; j++) if (!(a[j] === b[j] || (isNaN(a[j]) && isNaN(b[j])))) return true; return false; });
    const off = c => { c.o.wc = 0; c.o.bl = 0; c.fx = Object.assign({}, c.fx, {eb: false}); };
    const Rb = run([build(H, P, row('base.none')), build(H, P, row('base.a0')), build(H, P, row('base.a1')),
      build(H, P, row('base.none'), off), build(H, P, row('base.a0'), off), build(H, P, row('base.a1'), off)]);
    const d1 = [diff(Rb[0], Rb[3]), diff(Rb[1], Rb[4]), diff(Rb[2], Rb[5])];
    say(d1.every(d => !d.length), 'check 1: every new option at its off value (wc 0, bl 0, fx.eb false; sl absent) changes no key (no programme, a 0, a 1): ' + d1.map(d => d.length).join(' / ') + ' keys differ');
    const Ra = run([build(H, P, row('Achk.full.a0'))].concat(SH.map(sh => build(H, P, row('Achk.strict.' + sh + '.a1')))));
    const d2 = diff(Rb[1], Ra[0], OWN), d3 = [1, 2, 3].map(i => diff(Rb[2], Ra[i], OWN));
    say(!d2.length, 'check 2: sl full at a = 0 equals the base programme row in every key but the limit\'s own: ' + d2.length + ' differ' + (d2.length ? ' (' + d2.slice(0, 6).join(',') + ')' : ''));
    say(d3.every(d => !d.length), 'check 3: sl strict at a = 1, each rule, equals the main row in every key but the limit\'s own: ' + d3.map(d => d.length).join(' / ') + ' differ');
    const nA = build(H, P, row('base.none'), c => { c.o.sl = {rd: 'strict', sh: 'pay'}; c.o.bl = 2; });
    const Rn = run([nA, build(H, P, row('B.w0.5.c1.none')), build(H, P, row('B.w0.75.c0.none'))]), d4 = Rn.map(r => diff(Rb[0], r));
    say(d4.every(d => !d.length), 'check 4: the no-programme run is unchanged by sl and bl, and by wIdx and wc (no programme inflation): ' + d4.map(d => d.length).join(' / ') + ' keys differ');
    const R5 = run([build(H, P, row('base.a0'), c => { c.o.wIdx = 1; c.o.wc = 1; }), build(H, P, row('base.a0'), c => { c.o.bl = 0; })]), d5 = R5.map(r => diff(Rb[1], r));
    say(d5.every(d => !d.length), 'check 5: wc 1 with wIdx 1, and bl 0, change nothing (a 0): ' + d5.map(d => d.length).join(' / ') + ' keys differ');
    const on = ['A.sourced.pay.a0', 'A.restricted.even.a0.25', 'A.strict.bu.a0.5', 'B.w0.5.c1.a0', 'B.w0.5.c1.none', 'C.L0.125.a0', 'C.L2.a0.75', 'X.ABC.bu.a0.25', 'X.ABC.pay.a0', 'E.eb.a0', 'E.p95.a1'];
    const A = H.acctDrawCheck(on.map(n => build(H, P, row(n))), 1, P, so);
    say(A.acct.nFail === 0, 'check 6: the money accounts (MODEL_SPEC section 11) close with the new options on (' + on.length + ' rows, seed 1): ' + Object.keys(A.acct.byId || {}).length + ' identities failing; checks ' + JSON.stringify(A.acct.n));
    say(A.draws.bad === 0 && A.draws.runs > 0, 'check 7: eight draws per adult-year in every run (' + A.draws.runs + ' runs; ' + A.draws.bad + ' off)' + (A.nonFinite.length ? '; non-finite outputs ' + A.nonFinite.slice(0, 6).join(',') : ''));
    /* check 9 (Amendment 3): the building speed given at the sourced values is the sourced row; at 0 it moves the limit; the reporting keys move no
     * other key; every run reads the same seed's no-programme median (s82Ok 1), and the no-programme run reads its own (s82Mw0 = medWealthReal) */
    const R9 = run([build(H, P, row('A.sourced.pay.a0')), build(H, P, row('A.sourced.pay.a0'), c => { c.o.sl.lam = {medical: 0.25, food: 0.25}; }), build(H, P, row('Slam.lam0.pay.a0'))]);
    const R9o = H.tbStudy([build(H, P, row('base.none')), build(H, P, row('base.a0'))], N, P, H.r2MainStudy());
    const d9 = [diff(R9[0], R9[1]), diff(Rb[0], R9o[0], /^s82/), diff(Rb[1], R9o[1], /^s82/)], mv9 = diff(R9[0], R9[2]).length;
    const own9 = Array.from(Rb[0]._s.s82Mw0).every((x, j) => x === Rb[0]._s.medWealthReal[j]) && [Rb[0], Rb[1], Rb[2], R9[2]].every(r => Array.from(r._s.s82Ok).every(x => x === 1));
    /* check 10 (Amendment 4): theta at the engine's own values given explicitly is the base row; doubled it moves the programme run and leaves the
     * no-programme run unchanged (its supply path is its own demand, so no essentials price moves there) */
    const R10 = run([build(H, P, row('base.a0'), c => { c.o.theta = {food: 0, housing: 0.6, medical: 0.5}; }), build(H, P, row('Th.double.base.a0')), build(H, P, row('base.none'), c => { c.o.theta = {housing: 1.2, medical: 1.0}; })]);
    const d10 = [diff(Rb[1], R10[0]), diff(Rb[0], R10[2])], mv10 = diff(Rb[1], R10[1]).length;
    say(d10.every(d => !d.length) && mv10 > 0, 'check 10 (Amendment 4): theta at its own values changes nothing (' + d10[0].length + ' keys differ); doubled it moves ' + mv10 + ' keys of the programme run and ' + d10[1].length + ' of the no-programme run');
    say(d9.every(d => !d.length) && mv9 > 0 && own9, 'check 9 (Amendment 3): sl.lam at the sourced values equals the sourced row (' + d9[0].length + ' keys differ), at 0 moves ' + mv9 + ' keys; the study option s82 moves no other key (' + d9[1].length + ' / ' + d9[2].length + '); s82Ok 1 and the no-programme run\'s s82Mw0 equals its median: ' + own9);
    const P3 = Object.assign({}, P, {years: 3}), t0 = Date.now(), nf = [];
    D.forEach(r => { try { const R = H.tbStudy([build(H, P3, r)], 1, P3, so); KEYS.forEach(k => { if (R[0]._s[k] && !Number.isFinite(R[0]._s[k][0])) nf.push(r.name + ':' + k); }); }
      catch (e) { nf.push(r.name + ': threw ' + e.message); } });
    say(!nf.length, 'every row runs (3 years, seed 1): ' + D.length + ' rows' + (nf.length ? '; ' + nf.slice(0, 10).join(' | ') : '') + ' (' + ((Date.now() - t0)/1000).toFixed(0) + ' s)');
  } finally { S.restore(); }
  process.exit(fail ? 1 : 0);
}

/* ---- --dry: every environment and horizon, one after another, each with --procs, into one file with the timings ---- */
if (process.argv.includes('--dry')) {
  const cp = require('child_process'), mm = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), k = +arg('procs', 1), t0 = Date.now();
  if (!mm || !out) { console.error('usage: s82.js --dry --seeds=A-B --out=FILE [--procs=K]'); process.exit(1); }
  const res = {_meta: null, rows: {}}, timings = [];
  ['ref', 'adv', 'str'].forEach(e => [20, 40].forEach(y => {
    const f = out.replace(/\.json$/, '') + '.' + e + '-' + y + '.json';
    const r = cp.spawnSync(process.execPath, [__filename, '--env=' + e, '--years=' + y, '--seeds=' + mm[1] + '-' + mm[2], '--out=' + f, '--procs=' + k], {stdio: 'inherit'});
    if (r.status !== 0) { console.error(e + ' ' + y + ' exited ' + r.status); process.exit(1); }
    const d = JSON.parse(fs.readFileSync(f, 'utf8')), t = JSON.parse(fs.readFileSync(f.replace(/\.json$/, '') + '.timing.json', 'utf8'));
    if (!res._meta) res._meta = Object.assign({}, d._meta, {what: 'S82 dry run: every environment and horizon', env: 'all', years: 'both', rowsRun: null,
      command: 'node runner/jobs/s82.js --dry --seeds=' + mm[1] + '-' + mm[2] + ' --procs=' + k});
    Object.keys(d.rows).forEach(n => { res.rows[y + '.' + n] = d.rows[n]; });
    timings.push(Object.assign({env: e, years: y}, t)); fs.unlinkSync(f); fs.unlinkSync(f.replace(/\.json$/, '') + '.timing.json'); }));
  res._meta.timings = timings.map(t => ({env: t.env, years: t.years, rows: t.rows, seconds: t.seconds, rowSeconds: t.rowSeconds}));
  fs.writeFileSync(out, JSON.stringify(res));
  const secs = (Date.now() - t0)/1000, n = +mm[2] - +mm[1] + 1;
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({seeds: n, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(2), peakRssMB: Math.max(...timings.map(t => t.peakRssMB)), node: process.version}));
  console.error('s82 dry run seeds ' + mm[1] + '-' + mm[2] + ': ' + secs.toFixed(1) + ' s');
  process.exit(0);
}

/* ---- a run ---- */
const env = arg('env', ''), years = +arg('years', 0), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
if (!ENVN[env] || ![20, 40].includes(years) || !m || !out || !Number.isInteger(procs) || procs < 1) {
  console.error('usage: s82.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now(), D = design(), rm = /^(\d+)-(\d+)$/.exec(arg('rows', '0-' + (D.length - 1))), r0 = +rm[1], r1 = Math.min(D.length - 1, +rm[2]);
const pass = process.argv.filter(x => /^--(env|years|seeds)=/.test(x)), cmd = 'node runner/jobs/s82.js --env=' + env + ' --years=' + years + ' --seeds=' + lo + '-' + hi;
if (procs > 1 && r1 > r0) {
  const cp = require('child_process'), n0 = r1 - r0 + 1, k = Math.min(procs, n0), parts = []; let s0 = r0;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename].concat(pass, ['--rows=' + q.from + '-' + q.to, '--out=' + q.file]), {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const Dp = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o2 = Dp[0], rows = {};
    Dp.forEach(d => Object.keys(d.rows).forEach(n => { rows[n] = d.rows[n]; }));
    const sorted = {}; Object.keys(rows).sort().forEach(n => { sorted[n] = rows[n]; });
    o2.rows = sorted; o2._meta.rowsRun = [r0, r1]; o2._meta.design = D.slice(r0, r1 + 1); o2._meta.command = cmd + (r0 === 0 && r1 === D.length - 1 ? '' : ' --rows=' + r0 + '-' + r1);
    fs.writeFileSync(out, JSON.stringify(o2));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000;
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, years, seeds: hi - lo + 1, rows: r1 - r0 + 1, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(2),
      rowSeconds: [].concat(...T.map(t => t.rowSeconds)), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error('s82 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = engine(), S = H.startRelease({baseline: {env: BASE_ENV[env]}});
  const res = {_meta: {what: 'S82 v6 batch (research-update prereg/2026-11-s82-v6-supply-indexing.md, Amendments 1-4): per-seed values, every row', env, years, adults: 500,
    seeds: [lo, hi], rowsRun: [r0, r1], keys: KEYS.concat(['ppovA', 'pmedWA'], years > 20 ? ['ppov20', 'pmedW20'] : [], ['every key with the prefix sl or s82']), digits: DIGITS,
    manifest: H.runManifest(), baseline: S.baseline, design: D.slice(r0, r1 + 1), command: cmd + (r0 === 0 && r1 === D.length - 1 ? '' : ' --rows=' + r0 + '-' + r1)}, rows: {}};
  const tRow = [];
  try {
    const P = Object.assign({}, H[ENVN[env]], {years, nAgents: 500}), so = study(H);
    for (let i = r0; i <= r1; i++) { const t1 = Date.now(), R = H.tbStudy([build(H, P, D[i])], hi, P, so, lo);
      res.rows[env + '.' + String(i).padStart(3, '0') + '.' + D[i].name] = values(R[0]._s, years); tRow.push(+((Date.now() - t1)/1000/(hi - lo + 1)).toFixed(3)); }
  } finally { S.restore(); }
  const sorted = {}; Object.keys(res.rows).sort().forEach(n => { sorted[n] = res.rows[n]; }); res.rows = sorted;
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(S.withSettings(res)));
  const secs = (Date.now() - t0)/1000, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, years, seeds: hi - lo + 1, rows: r1 - r0 + 1, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(2), rowSeconds: tRow, peakRssMB: rss, node: process.version}));
  console.error('s82 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ' rows ' + r0 + '-' + r1 + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
