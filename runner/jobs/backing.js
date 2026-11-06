#!/usr/bin/env node
/* S51 (Nov 2, 2026): the backing study's job script (research-update prereg/2026-11-backing-addendum.md). It builds exactly the addendum's rows and runs them
 * on a range of seeds, in one or all three environments. Every row starts from the runner's reference job (release-pair.js): relMainCfgs(tbPresets(P)) with
 * sc SPEND_SOURCED and sn {abawd, slope}, applyNR6(), tbSetG(TB_PROFILE_G), study options {fin: 'tax', aT: 0, a: 0, X: 0, sc} plus REL_V52_STUDY.
 * Each row then changes only what its name says, in its row options (c.o):
 *   DESIGN       rel (the release row as released) or c22 (the C2.2 design, CPS yardstick; its none row is the plain none row with that yardstick)
 *   wWW          wage indexation to the programme's price level, WW% (o.wIdx = WW/100; the release row is w100)
 *   none         the no-programme run (element 0 of relMainCfgs)
 *   aAA          arm A: the release row with AA% of the Source's net payout assumed backed (o.a = AA/100; a0 is the release row itself)
 *   bk.ACCT.fF.rR.cC[.lagL][.dep0]
 *                arm B: the backing mechanism (o.bkm): ACCT g (only added output backs new money) or r (proceeds retire the money); f = F/100 of the net
 *                payout funds supply-adding projects; rho = R/100 output a year per dollar funded; ceiling cap = C/100 of earned income (cx = none);
 *                lag 2 years and wear 5% a year unless .lagL or .dep0 says otherwise.
 *   sv.none, sv.aAA  (addendum Amendment 1, item 1) arm A and its none rows with savings that keep up with prices (row option sv), both designs
 *   ci.aAA       (Amendment 1, item 2) the release design's arm A at 90, 95 and 100% with the BU raised to the price level every year (p.colaThresh -1)
 * --frozen (S47): every row on the frozen engine (harness.js frozenRow), as the S48 batch runs it.
 * Rows are named ENV.DESIGN.wWW.ROW. Each row holds one value per seed for every measure in KEYS. Seeds are paired and independent, so any split of 1..N joins to the
 * same numbers. --procs=K cuts the seeds into K pieces run as K processes and joins them (the same bytes as one process).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/backing.js --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1] [--frozen]
 *   node RESULTS/runner/jobs/backing.js --check      (the row count against the addendum; no output file)
 * FILE holds only deterministic content; seconds and memory go to stderr and FILE without .json plus .timing.json. */
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const FRZ = process.argv.includes('--frozen');  /* S47 (run manifest section 6 item 7): every row, the no-programme rows included, on the frozen engine (harness.js frozenRow: au, fx, the share 0.877) */

/* The addendum's grid. Two designs: rel, the release row as released (released wages; the plan's subject and the audit's E6 table), and c22, the C2.2
 * design (the study programme's headline design from S47, Amendment 4: BU at the cost of basic needs, automatic distribution; CPS earnings yardstick). */
const W_ALL = [100, 95, 90, 75], A_GRID = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 100];
const W_B = [100, 90], ACCT = ['g', 'r'], F_GRID = [25, 50, 100], R_GRID = [5, 10, 20, 32];
const C_GRID = {rel: [8, 16, null], c22: [8, null]};
const SENS = ['lag1', 'lag3', 'dep0'];   /* rel only: at f100, r20, cx, w100, both readings */
/* per environment: rel: none x 4, arm A 12 x 4, arm B 2 x 3 x 4 x 3 x 2, sensitivities 3 x 2 (202); c22: none x 4, arm A 12 x 4, arm B 2 x 3 x 4 x 2 x 2 (148) */
const PREREG_ROWS = 202 + 148 + 104 + 12;  /* S47: addendum Amendment 1's sensitivities (sv 2 x 52, ci 12) */
const KEYS = ['bNAPy', 'bOAPy', 'fgt0PY', 'pf0_19', 'pov', 'ppov_19', 'cost', 'srcPay', 'srcTax', 'srcM', 'pLev10', 'pLev20', 'endoAnn',
  'bkA', 'bkPY', 'bkmA', 'bkm5', 'bkm10', 'bkm19', 'bkmO19', 'bkmF',
  'giniD', 'eGiniW', 'hrs', 'fgt2PY', 'hhFplPY', 'hhCostKidPY', 'gPartF0', 'gNonF0', 'gPartW', 'gNonW', 'medWealthReal', 'emp', 'jnP19', 'octMean'];

function rows(H, P) {
  const SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true}, out = [];
  const pair = d => H.relMainCfgs(H.tbPresets(P)).map((c, i) => { Object.assign(c, {sc: SC, sn: SN});
    if (d === 'c22'){ c.lt = {s: 'all', m: 'all'}; if (i === 1){ c.c22 = {auto: true, idx: 'needs'}; c.p = Object.assign({}, c.p, {bu: H.c22NeedsBU()}); } }
    return c; });
  const add = (name, c, f) => { c.o = Object.assign({}, c.o || {}); f(c.o); out.push([name, c]); };
  ['rel', 'c22'].forEach(d => {
    W_ALL.forEach(w => add(d + '.w' + w + '.none', pair(d)[0], o => { o.wIdx = w/100; }));
    W_ALL.forEach(w => A_GRID.forEach(a => add(d + '.w' + w + '.a' + a, pair(d)[1], o => { o.wIdx = w/100; o.a = a/100; })));
    const bk = (w, acct, f, r, c, s) => add(d + '.w' + w + '.bk.' + acct + '.f' + f + '.r' + r + '.c' + (c === null ? 'x' : c) + (s ? '.' + s : ''), pair(d)[1], o => {
      o.wIdx = w/100; o.bkm = {f: f/100, rho: r/100, lag: s === 'lag1' ? 1 : s === 'lag3' ? 3 : 2, dep: s === 'dep0' ? 0 : 0.05, acct: acct === 'g' ? 'growth' : 'retire'};
      if (c !== null) o.bkm.cap = c/100; });
    W_B.forEach(w => ACCT.forEach(acct => F_GRID.forEach(f => R_GRID.forEach(r => C_GRID[d].forEach(c => bk(w, acct, f, r, c, null))))));
    if (d === 'rel') ACCT.forEach(acct => SENS.forEach(s => bk(100, acct, 100, 20, null, s)));
    const sv = c => { c.sv = true; return c; }, ci = c => { c.p = Object.assign({}, c.p, {colaThresh: -1}); return c; };  /* Amendment 1 (S47) */
    W_ALL.forEach(w => add(d + '.w' + w + '.sv.none', sv(pair(d)[0]), o => { o.wIdx = w/100; }));
    W_ALL.forEach(w => A_GRID.forEach(a => add(d + '.w' + w + '.sv.a' + a, sv(pair(d)[1]), o => { o.wIdx = w/100; o.a = a/100; })));
    if (d === 'rel') W_ALL.forEach(w => [90, 95, 100].forEach(a => add(d + '.w' + w + '.ci.a' + a, ci(pair(d)[1]), o => { o.wIdx = w/100; o.a = a/100; })));
  });
  return out;
}

if (process.argv.includes('--check')) {
  const H = require(path.join(process.cwd(), 'harness.js')), R = rows(H, Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 500}));
  const names = new Set(R.map(r => r[0]));
  const ok = R.length === PREREG_ROWS && names.size === R.length;
  console.log((ok ? 'PASS' : 'FAIL') + '  rows per environment: ' + R.length + ' (addendum: ' + PREREG_ROWS + '), distinct names: ' + names.size);
  process.exit(ok ? 0 : 1);
}

const env = arg('env', 'ref'), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
const ENVS = env === 'all' ? ['ref', 'adv', 'st'] : [env];
if (!ENVS.every(e => ENVN[e]) || !m || !out || !Number.isInteger(procs) || procs < 1) { console.error('usage: backing.js --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now();
if (procs > 1 && hi > lo) {
  const cp = require('child_process'), k = Math.min(procs, hi - lo + 1), n0 = hi - lo + 1, parts = []; let s0 = lo;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename, '--env=' + env, '--seeds=' + q.from + '-' + q.to, '--out=' + q.file].concat(FRZ ? ['--frozen'] : []), {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const D = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o = D[0];
    o._meta.seeds = [lo, hi]; o._meta.command = o._meta.command.replace(/--seeds=\d+-\d+/, '--seeds=' + lo + '-' + hi);
    Object.keys(o.rows).forEach(r => Object.keys(o.rows[r]).forEach(key => { o.rows[r][key] = [].concat(...D.map(d => d.rows[r][key])); }));
    fs.writeFileSync(out, JSON.stringify(o));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000, n = hi - lo + 1;
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, seeds: n, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error(env + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = require(path.join(process.cwd(), 'harness.js'));
  const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  const o = {_meta: {what: 'S51 backing study (prereg/2026-11-backing-addendum.md): per-seed values', env, seeds: [lo, hi], adults: 500, years: 20, keys: KEYS, manifest: H.runManifest(), frozen: FRZ ? H.FROZEN : null,
    command: 'node runner/jobs/backing.js --env=' + env + ' --seeds=' + lo + '-' + hi + (FRZ ? ' --frozen' : '')}, rows: {}};
  try {
    ENVS.forEach(e => {
      const P = Object.assign({}, H[ENVN[e]], {years: 20, nAgents: 500}), so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: H.SPEND_SOURCED}, H.REL_V52_STUDY);
      const R0 = rows(H, P), R = H.tbStudy(R0.map(r => FRZ ? H.frozenRow(r[1]) : r[1]), hi, P, so, lo);
      R0.forEach((r, i) => { const v = {}; KEYS.forEach(k => { if (R[i]._s[k]) v[k] = Array.from(R[i]._s[k]); }); o.rows[e + '.' + r[0]] = v; });
    });
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(o));
  const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, seeds: n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss, node: process.version}));
  console.error(env + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s (' + (secs/n).toFixed(2) + ' s a seed), peak memory ' + rss + ' MB');
}
