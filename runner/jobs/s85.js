#!/usr/bin/env node
/* S85 (Nov 19, 2026): output per hour and automation, with the backing produced, as preregistered in research-update
 * prereg/2026-11-s85-output-per-hour.md (Amendments 1 and 2). Engine: compassionism-simulation v5.9.21, which adds the row option oh (off = identical).
 * This script changes no engine line.
 *
 * Every row is the frozen main row (harness.js r2FreezePair) with the private BU price at the sale (sp.vAt 'sale', the corrected model), in two designs:
 * full coverage (c22) and opt-in (rel). Programme rows are named <block>.<design>.<reading>; each programme row's no-programme run is the row
 * 'none.<key>', where <key> is its both-run settings (D, T, f, ord, g, pw, own), so rows that share them share it (the no-programme run does not read the
 * design, kp, bk, a, sl, wIdx, wc or bl). Blocks (each in both designs; T 20, gain low, pw 0.7, ord risk, own 0.5409 unless stated):
 *   A  D 0.1, 0.3, 0.5, 0.7 x f jobs, hours; D 0 (gain only); oh off (the main row)                                             10
 *   B  at D 0.5 jobs: gain none, gain high, pw 0, pw 1; D 0 at gain high                                                         5
 *   C  T 40 at D 0.3, 0.5, 0.7 jobs                                                                                               3
 *   D  ord even at D 0.5 jobs and hours; own 0.5 and 1 (the sourced value's bounds) at D 0.5 jobs; kp workers at D 0.3, 0.5 hours  6
 *   E  the backing produced (a 0): D 0, 0.3, 0.5, 0.7 jobs x gain low, high x m 0.25, 0.5, 1; acct growth at m 1 x gain low, high
 *      x D 0, 0.5; the floor (m 0, no capital term) at D 0, 0.5; at m 0.5, 1 x D 0, 0.5, gain high: conv, gain, conv and gain;
 *      vk at m 1 x D 0, 0.5, gain high                                                                                            44
 *   F  together: E's main reading at m 0.5, 1 x gain low, high x D 0, 0.5 with sl sourced (the design's rule), wIdx 0.75 with
 *      wc 1, and bl one month                                                                                                       8
 *   G  check: oh D 0 with no gain (must equal the main row)                                                                         1
 * That is 77 programme rows per design (154) and 25 no-programme runs: 179 per environment and horizon.
 * Outputs: every key the engine reports, at full precision, per seed. One results folder per environment and horizon: s85-<env>-<years>-<engine 7>.
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/s85.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]
 *   node RESULTS/runner/jobs/s85.js --check     (prints the row count and checks each programme row against its no-programme run's key)
 * Every run first passes the release start's baseline check and records the effective settings (_settings). --procs=K cuts the rows into K pieces
 * run as K processes and joins them (the same bytes as one process). FILE holds only deterministic content; timings go to FILE.timing.json. */
'use strict';
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', str: 'STRESS_TEST'}, BASE_ENV = {ref: 'ref', adv: 'adv', str: 'st'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const engine = () => require(path.join(process.cwd(), 'harness.js'));
const OWN = 0.5409, BASE = {D: 0, T: 20, f: 'jobs', ord: 'risk', g: 'low', pw: 0.7, own: OWN};
const BOTH = ['D', 'T', 'f', 'ord', 'g', 'pw', 'own'];
const keyOf = oh => oh ? BOTH.map(k => k + oh[k]).join('_') : 'off';

/* the design rows: {name, des, oh (null = off), a (null = the frozen row's), sl, w, wc, L} */
function design() {
  const R = [], add = (blk, rd, oh, x) => ['c22', 'rel'].forEach(des => R.push(Object.assign({name: blk + '.' + des + '.' + rd, des, oh: oh ? Object.assign({}, BASE, oh) : null, a: null, sl: null, w: null, wc: null, L: null}, x || {})));
  const D4 = [0.1, 0.3, 0.5, 0.7];
  D4.forEach(D => ['jobs', 'hours'].forEach(f => add('A', f + '.D' + D, {D, f})));
  add('A', 'gain.D0', {D: 0}); add('A', 'off', null);
  add('B', 'gnone.D0.5', {D: 0.5, g: 'none'}); add('B', 'ghigh.D0.5', {D: 0.5, g: 'high'}); add('B', 'pw0.D0.5', {D: 0.5, pw: 0}); add('B', 'pw1.D0.5', {D: 0.5, pw: 1}); add('B', 'ghigh.D0', {D: 0, g: 'high'});
  [0.3, 0.5, 0.7].forEach(D => add('C', 'T40.D' + D, {D, T: 40}));
  add('D', 'even.jobs.D0.5', {D: 0.5, ord: 'even'}); add('D', 'even.hours.D0.5', {D: 0.5, f: 'hours', ord: 'even'});
  add('D', 'own0.5.D0.5', {D: 0.5, own: 0.5}); add('D', 'own1.D0.5', {D: 0.5, own: 1});
  [0.3, 0.5].forEach(D => add('D', 'kp.hours.D' + D, {D, f: 'hours', kp: 'workers'}));
  const bk = (b, D, g) => ({D, g, bk: b});
  [0, 0.3, 0.5, 0.7].forEach(D => ['low', 'high'].forEach(g => [0.25, 0.5, 1].forEach(m => add('E', 'm' + m + '.g' + g + '.D' + D, bk({m}, D, g), {a: 0}))));
  ['low', 'high'].forEach(g => [0, 0.5].forEach(D => add('E', 'growth.m1.g' + g + '.D' + D, bk({m: 1, acct: 'growth'}, D, g), {a: 0})));
  [0, 0.5].forEach(D => add('E', 'floor.D' + D, bk({m: 0, y0: true}, D, 'low'), {a: 0}));
  [0.5, 1].forEach(m => [0, 0.5].forEach(D => {
    add('E', 'conv.m' + m + '.ghigh.D' + D, bk({m, conv: true}, D, 'high'), {a: 0});
    add('E', 'gain.m' + m + '.ghigh.D' + D, bk({m, gain: true}, D, 'high'), {a: 0});
    add('E', 'convgain.m' + m + '.ghigh.D' + D, bk({m, conv: true, gain: true}, D, 'high'), {a: 0}); }));
  [0, 0.5].forEach(D => add('E', 'vk.m1.ghigh.D' + D, bk({m: 1, vk: true}, D, 'high'), {a: 0}));
  [0.5, 1].forEach(m => ['low', 'high'].forEach(g => [0, 0.5].forEach(D => add('F', 'm' + m + '.g' + g + '.D' + D, bk({m}, D, g), {a: 0, sl: {rd: 'sourced', sh: 'bu'}, w: 0.75, wc: 1, L: 0.125}))));
  add('G', 'zero', {D: 0, g: 'none'});
  const none = {}; R.forEach(r => { const k = keyOf(r.oh); if (!none[k]) none[k] = {name: 'none.' + k, des: null, oh: r.oh ? Object.assign({}, r.oh, {kp: null, bk: null}) : null, prog: false}; r.none = 'none.' + k; r.prog = true; });
  const N = Object.keys(none).sort().map(k => none[k]);
  return N.concat(R);
}
/* --sec (S85 part 3, the preregistration's Amendment 3): blocks A and F and the no-programme runs they pair with, with the security measures on (o.sec,
 * reporting only, no draw), for the preregistered savings measure. Without the flag the job is unchanged. */
const SEC = process.argv.includes('--sec');
const ROWS = (D => { if (!SEC) return D; const P = D.filter(r => r.prog && /^[AF]\./.test(r.name)), need = new Set(P.map(r => r.none));
  return D.filter(r => !r.prog && need.has(r.name)).concat(P); })(design()), NAMES = ROWS.map(r => r.name);

/* one row's configuration */
function build(H, P, r) {
  const c = H.r2FreezePair(P, r.des || 'c22')[r.prog ? 1 : 0];
  c.sp = Object.assign({}, c.sp || {}, {vAt: 'sale'});
  if (r.oh) { const o = Object.assign({}, r.oh); if (!o.kp) delete o.kp; if (!o.bk) delete o.bk; c.oh = JSON.parse(JSON.stringify(o)); }
  c.o = Object.assign({}, c.o || {});
  if (SEC) c.o.sec = true;
  if (r.prog && r.a !== null) c.o.a = r.a;
  if (r.sl) c.o.sl = Object.assign({}, r.sl);
  if (r.w !== null) { c.o.wIdx = r.w; c.o.wc = r.wc; }
  if (r.L !== null) c.o.bl = r.L;
  return c;
}
const full = x => Number.isFinite(x) ? x : null;
const values = s => { const v = {}; Object.keys(s).forEach(k => { v[k] = Array.from(s[k], full); }); return v; };

if (process.argv.includes('--check')) {
  const H = engine(), S = H.startRelease(); let ok = ROWS.length === (SEC ? 48 : 179) && new Set(NAMES).size === NAMES.length;
  try {
    const P = Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 500}), byName = {}; ROWS.forEach(r => { byName[r.name] = r; });
    ROWS.filter(r => r.prog).forEach(r => { const n = byName[r.none]; if (!n || n.prog) ok = false;
      const c = build(H, P, r), cn = build(H, P, n), strip = o => { if (!o) return null; const x = Object.assign({}, o); delete x.kp; delete x.bk; return JSON.stringify(x); };
      if (strip(c.oh) !== strip(cn.oh)) { ok = false; console.log('MISMATCH ' + r.name); }
      if (r.oh && r.oh.bk && c.o.a !== 0) { ok = false; console.log('bk row not at a 0: ' + r.name); } });
  } finally { S.restore(); }
  console.log(ROWS.filter(r => !r.prog).length + ' no-programme runs, ' + ROWS.filter(r => r.prog).length + ' programme rows, ' + ROWS.length + ' in all');
  console.log(ok ? 'check passed' : 'check FAILED'); process.exit(ok ? 0 : 1);
}

const env = arg('env', ''), years = +arg('years', 0), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
if (!ENVN[env] || ![20, 40].includes(years) || !m || !out || !Number.isInteger(procs) || procs < 1) {
  console.error('usage: s85.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now();
const rm = /^(\d+)-(\d+)$/.exec(arg('rows', '0-' + (NAMES.length - 1))), r0 = +rm[1], r1 = Math.min(NAMES.length - 1, +rm[2]);
const pass = process.argv.filter(x => /^--(env|years|seeds)=/.test(x) || x === '--sec');
const cmd = 'node runner/jobs/s85.js --env=' + env + ' --years=' + years + ' --seeds=' + lo + '-' + hi + (SEC ? ' --sec' : '');
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
    console.error('s85 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = engine(), S = H.startRelease({baseline: {env: BASE_ENV[env]}});
  const res = {_meta: {what: 'S85: output per hour and automation, with the backing produced (research-update prereg/2026-11-s85-output-per-hour.md): per-seed values of every key, every row',
    env, years, adults: 500, seeds: [lo, hi], rowsRun: [r0, r1], rowNames: NAMES, rowSpec: ROWS.map(r => ({name: r.name, none: r.none || null, des: r.des, oh: r.oh, a: r.a, sl: r.sl, wIdx: r.w, wc: r.wc, bl: r.L})),
    keys: 'all', digits: 'full', manifest: H.runManifest(), baseline: S.baseline, command: cmd + (r0 === 0 && r1 === NAMES.length - 1 ? '' : ' --rows=' + r0 + '-' + r1)}, rows: {}};
  const tRow = [];
  try {
    const P = Object.assign({}, H[ENVN[env]], {years, nAgents: 500});
    for (let i = r0; i <= r1; i++) { const t1 = Date.now(), X = H.tbStudy([build(H, P, ROWS[i])], hi, P, H.r2MainStudy(), lo);
      res.rows[env + '.' + ROWS[i].name] = values(X[0]._s); tRow.push(+((Date.now() - t1)/1000/(hi - lo + 1)).toFixed(3)); }
  } finally { S.restore(); }
  const sorted = {}; Object.keys(res.rows).sort().forEach(n => { sorted[n] = res.rows[n]; }); res.rows = sorted;
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(S.withSettings(res)));
  const secs = (Date.now() - t0)/1000, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, years, seeds: hi - lo + 1, rows: r1 - r0 + 1, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(2), rowSeconds: tRow, peakRssMB: rss, node: process.version}));
  console.error('s85 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ' rows ' + r0 + '-' + r1 + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
