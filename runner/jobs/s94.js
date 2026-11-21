#!/usr/bin/env node
/* S94 (Nov 21, 2026): the Creative Collectives' lending to start-ups where banks will not lend, and charters of public operators, as preregistered in
 * research-update prereg/2026-11-s94-collectives-lending.md (Amendments 1 and 2). Engine: compassionism-simulation c5682f9 (PR 174), which adds the
 * row option lend (off = identical). This script changes no engine line.
 *
 * Every row is the frozen main row as the output-per-hour study's job builds it (s85.js block A's 'off' rows: harness.js r2FreezePair, the private BU
 * price at the sale, sp.vAt 'sale'), with the security measures on (o.sec, reporting only, no draw) so savings is read, in two designs: full coverage
 * (c22) and opt-in (rel). The switch acts only in the programme run, so every programme row pairs with one shared no-programme run ('none').
 * Programme rows are named <block>.<design>.<reading>:
 *   M  the main row, lend absent                                                                                                   1
 *   A  the fund: main (pace 0.0296 'total', grant 0.1419, haz 'young'); pace x 0.5; pace x 2; no pace limit; paceOn 'lent';
 *      haz 'mature'; haz 'none'; grant 0 (all loans); grant 1 (all grants)                                                          9
 *   B  charters, no fund: ch 1/7, 1/3, 2/3                                                                                          3
 *   C  together: the fund's main reading and ch 1/7                                                                                 1
 *   D  check: lend {fund false, ch 0} (must equal M in every key)                                                                   1
 * That is 15 programme rows per design (30) and 1 no-programme run: 31 per environment and horizon.
 * Outputs: every key the engine reports, at full precision, per seed, and the derived yearly averages ppovA and pmedWA (see values). One results folder per environment and horizon: s94-<env>-<years>-<engine 7>.
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/s94.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]
 *   node RESULTS/runner/jobs/s94.js --check     (prints the row count and checks every row's settings: lend only where named, D's settings equal M's)
 * Every run first passes the release start's baseline check and records the effective settings (_settings). --procs=K cuts the rows into K pieces
 * run as K processes and joins them (the same bytes as one process). FILE holds only deterministic content; timings go to FILE.timing.json. */
'use strict';
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', str: 'STRESS_TEST'}, BASE_ENV = {ref: 'ref', adv: 'adv', str: 'st'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const engine = () => require(path.join(process.cwd(), 'harness.js'));
/* the fund's main reading, written out in full (the engine's LEND_DEFAULTS; --check confirms they agree) */
const FUND = {fund: true, pace: 0.0296, paceOn: 'total', grant: 0.1419, haz: 'young', ch: 0};

/* the design rows: {name, des, lend (null = absent), prog} */
function design() {
  const R = [], add = (blk, rd, lend) => ['c22', 'rel'].forEach(des => R.push({name: blk + '.' + des + '.' + rd, des, lend: lend ? Object.assign({}, lend) : null, prog: true}));
  const F = x => Object.assign({}, FUND, x || {});
  add('M', 'main', null);
  add('A', 'main', F()); add('A', 'pace0.5', F({pace: FUND.pace*0.5})); add('A', 'pace2', F({pace: FUND.pace*2})); add('A', 'nolimit', F({pace: null}));
  add('A', 'lent', F({paceOn: 'lent'})); add('A', 'mature', F({haz: 'mature'})); add('A', 'haznone', F({haz: 'none'}));
  add('A', 'grant0', F({grant: 0})); add('A', 'grant1', F({grant: 1}));
  [['1of7', 1/7], ['1of3', 1/3], ['2of3', 2/3]].forEach(([n, ch]) => add('B', 'ch' + n, F({fund: false, ch})));
  add('C', 'main.ch1of7', F({ch: 1/7}));
  add('D', 'zero', F({fund: false, ch: 0}));
  R.forEach(r => { r.none = 'none'; });
  return [{name: 'none', des: null, lend: null, prog: false}].concat(R);
}
const ROWS = design(), NAMES = ROWS.map(r => r.name);

/* one row's configuration */
function build(H, P, r) {
  const c = H.r2FreezePair(P, r.des || 'c22')[r.prog ? 1 : 0];
  c.sp = Object.assign({}, c.sp || {}, {vAt: 'sale'});
  c.o = Object.assign({}, c.o || {}, {sec: true});
  if (r.lend) c.lend = JSON.parse(JSON.stringify(r.lend));
  return c;
}
const full = x => Number.isFinite(x) ? x : null;
/* every key, plus the derived yearly averages ppovA and pmedWA over years 1 to T - 1 and, at 40 years, ppov20 and pmedW20, as runner/jobs/r2.js and
 * s82.js derive them (the yearly series' index t holds the reading at the end of year t + 1, so year 20 of a 40-year run is _19) */
function values(s, T) {
  const v = {}; Object.keys(s).forEach(k => { v[k] = Array.from(s[k], full); });
  const avg = p => s[p + '_1'] ? Array.from(s[p + '_1']).map((_, j) => { let a = 0; for (let t = 1; t < T; t++) a += s[p + '_' + t][j]; return full(a/(T - 1)); }) : undefined;
  v.ppovA = avg('ppov'); v.pmedWA = avg('pmedW');
  if (T > 20) { if (s.ppov_19) v.ppov20 = Array.from(s.ppov_19, full); if (s.pmedW_19) v.pmedW20 = Array.from(s.pmedW_19, full); }
  return v;
}

if (process.argv.includes('--check')) {
  const H = engine(), S = H.startRelease(); let ok = ROWS.length === 31 && new Set(NAMES).size === NAMES.length;
  try {
    const D = H.LEND_DEFAULTS; Object.keys(FUND).forEach(k => { if (D[k] !== FUND[k]) { ok = false; console.log('FUND differs from LEND_DEFAULTS at ' + k); } });
    if (Object.keys(D).length !== Object.keys(FUND).length) { ok = false; console.log('LEND_DEFAULTS has keys this job does not set'); }
    const P = Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 500}), strip = c => { const x = JSON.parse(JSON.stringify(c)); delete x.lend; delete x.name; delete x.label; return JSON.stringify(x); };
    ['c22', 'rel'].forEach(des => { const m = build(H, P, ROWS.find(r => r.name === 'M.' + des + '.main'));
      ROWS.filter(r => r.prog && r.des === des).forEach(r => { const c = build(H, P, r);
        if (strip(c) !== strip(m)) { ok = false; console.log('row differs from M beyond lend: ' + r.name); }
        if (!!c.lend !== !/^M\./.test(r.name)) { ok = false; console.log('lend present or absent in the wrong row: ' + r.name); }
        if (c.lend) H.ldOpts(c.lend); }); });
    const n = build(H, P, ROWS[0]); if (n.lend) ok = false;
  } finally { S.restore(); }
  console.log(ROWS.filter(r => !r.prog).length + ' no-programme run, ' + ROWS.filter(r => r.prog).length + ' programme rows, ' + ROWS.length + ' in all');
  console.log(ok ? 'check passed' : 'check FAILED'); process.exit(ok ? 0 : 1);
}

const env = arg('env', ''), years = +arg('years', 0), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
if (!ENVN[env] || ![20, 40].includes(years) || !m || !out || !Number.isInteger(procs) || procs < 1) {
  console.error('usage: s94.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now();
const rm = /^(\d+)-(\d+)$/.exec(arg('rows', '0-' + (NAMES.length - 1))), r0 = +rm[1], r1 = Math.min(NAMES.length - 1, +rm[2]);
const pass = process.argv.filter(x => /^--(env|years|seeds)=/.test(x));
const cmd = 'node runner/jobs/s94.js --env=' + env + ' --years=' + years + ' --seeds=' + lo + '-' + hi;
if (procs > 1 && r1 > r0) {
  const cp = require('child_process'), n0 = r1 - r0 + 1, k = Math.min(procs, n0), parts = []; let s0 = r0;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename].concat(pass, ['--rows=' + q.from + '-' + q.to, '--out=' + q.file]), {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const Dp = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o2 = Dp[0], all = {};
    Dp.forEach(d => Object.keys(d.rows).forEach(n => { all[n] = d.rows[n]; }));
    const sorted = {}; Object.keys(all).sort().forEach(n => { sorted[n] = all[n]; });
    o2.rows = sorted; o2._meta.rowsRun = [r0, r1]; o2._meta.command = cmd + (r0 === 0 && r1 === NAMES.length - 1 ? '' : ' --rows=' + r0 + '-' + r1);
    fs.writeFileSync(out, JSON.stringify(o2));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000;
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, years, seeds: hi - lo + 1, rows: r1 - r0 + 1, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(2),
      rowSeconds: [].concat(...T.map(t => t.rowSeconds)), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error('s94 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = engine(), S = H.startRelease({baseline: {env: BASE_ENV[env]}});
  const res = {_meta: {what: "S94: the Creative Collectives' lending and charters of public operators (research-update prereg/2026-11-s94-collectives-lending.md): per-seed values of every key, every row",
    env, years, adults: 500, seeds: [lo, hi], rowsRun: [r0, r1], rowNames: NAMES, rowSpec: ROWS.map(r => ({name: r.name, none: r.none || null, des: r.des, lend: r.lend})),
    lendKeys: H.LEND_KEYS, keys: 'all, and the derived ppovA, pmedWA (ppov20, pmedW20 at 40 years)', digits: 'full', manifest: H.runManifest(), baseline: S.baseline, command: cmd + (r0 === 0 && r1 === NAMES.length - 1 ? '' : ' --rows=' + r0 + '-' + r1)}, rows: {}};
  const tRow = [];
  try {
    const P = Object.assign({}, H[ENVN[env]], {years, nAgents: 500});
    for (let i = r0; i <= r1; i++) { const t1 = Date.now(), X = H.tbStudy([build(H, P, ROWS[i])], hi, P, H.r2MainStudy(), lo);
      res.rows[env + '.' + ROWS[i].name] = values(X[0]._s, years); tRow.push(+((Date.now() - t1)/1000/(hi - lo + 1)).toFixed(3)); }
  } finally { S.restore(); }
  const sorted = {}; Object.keys(res.rows).sort().forEach(n => { sorted[n] = res.rows[n]; }); res.rows = sorted;
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(S.withSettings(res)));
  const secs = (Date.now() - t0)/1000, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, years, seeds: hi - lo + 1, rows: r1 - r0 + 1, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(2), rowSeconds: tRow, peakRssMB: rss, node: process.version}));
  console.error('s94 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ' rows ' + r0 + '-' + r1 + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
