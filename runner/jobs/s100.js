#!/usr/bin/env node
/* S100 (Nov 21, 2026): part-time work (pay by household type) and the child and dependent care credit in the no-programme yardstick, as preregistered in
 * research-update prereg/2026-11-s100-part-time-dcc.md. The engine commit adds the row option eh and the safety-net options cdc and rep (off by default,
 * off = identical); this script changes no engine line.
 *
 * Rows per environment and horizon (prereg Design, "Rows"); every row is the release's main row (harness.js r2FreezePair with the private BU price at the
 * sale, sp.vAt 'sale', as runner/jobs/s90.js builds c22.sale and rel.sale) with sn.rep true (reporting keys only; the engine's unit test shows it moves no key):
 *   none.R, c22.R, rel.R  for each reading R:
 *     off    the release's main row
 *     eh     pay by household type, partners correlated at the survey's value (eh {})
 *     cdc    the child and dependent care credit, for households that pay for care (sn.cdc true)
 *     both   eh and cdc
 *     pc0    both, partners' pay independent (eh {pc: 0})
 *     call   both, the credit read for every household with a child under 13 (sn.cdc 'all')
 *   c22.bound, rel.bound   both, but the programme run without the credit (it pairs with none.both: the credit in the no-programme run only)
 *   none.off.full, none.both.full   the yardstick at full take-up of the tax credits (sn.taxTake 1), no-programme only
 * Row names are <env>.<row>. Outputs: every key the engine reports, at full precision, per seed. One folder per environment and horizon:
 * s100-<env>-<years>-<engine 7>.
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/s100.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]
 *   node RESULTS/runner/jobs/s100.js --check      (prints the rows and checks each differs from the release row only by the options named above)
 * Every run first passes the release start's baseline check and records the effective settings (_settings), as runner/jobs/s90.js. */
'use strict';
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', str: 'STRESS_TEST'}, BASE_ENV = {ref: 'ref', adv: 'adv', str: 'st'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const READ = {off: {}, eh: {eh: {}}, cdc: {sn: {cdc: true}}, both: {eh: {}, sn: {cdc: true}}, pc0: {eh: {pc: 0}, sn: {cdc: true}}, call: {eh: {}, sn: {cdc: 'all'}}};
const NAMES = [].concat(...Object.keys(READ).map(r => ['none.' + r, 'c22.' + r, 'rel.' + r]), ['c22.bound', 'rel.bound', 'none.off.full', 'none.both.full']);
const engine = () => require(path.join(process.cwd(), 'harness.js'));

/* the rows: [name, cfg]; each row is a fresh copy (its own r2FreezePair call) */
function rows(H, P) {
  const base = n => { const c = n === 'none' ? H.r2FreezePair(P, 'c22')[0] : H.r2FreezePair(P, n)[1]; if (n !== 'none') c.sp = Object.assign({}, c.sp, {vAt: 'sale'}); c.sn = Object.assign({}, c.sn, {rep: true}); return c; };
  const read = (c, x) => { if (x.eh) c.eh = Object.assign({}, x.eh); if (x.sn) c.sn = Object.assign({}, c.sn, x.sn); return c; };
  const out = [];
  Object.keys(READ).forEach(r => ['none', 'c22', 'rel'].forEach(d => out.push([d + '.' + r, read(base(d), READ[r])])));
  ['c22', 'rel'].forEach(d => out.push([d + '.bound', read(base(d), {eh: {}})]));
  out.push(['none.off.full', read(base('none'), {sn: {taxTake: 1}})], ['none.both.full', read(base('none'), {eh: {}, sn: {cdc: true, taxTake: 1}})]);
  out.forEach((r, i) => { if (r[0] !== NAMES[i]) throw new Error('row order'); });
  return out;
}
const full = x => Number.isFinite(x) ? x : null;
const values = s => { const v = {}; Object.keys(s).forEach(k => { v[k] = Array.from(s[k], full); }); return v; };

if (process.argv.includes('--check')) {
  const H = engine(), S = H.startRelease();
  let ok = true;
  const strip = c => { const a = JSON.parse(JSON.stringify(c)); delete a.eh; if (a.sn){ delete a.sn.cdc; delete a.sn.taxTake; } return JSON.stringify(a); };
  try {
    ['ref', 'adv', 'str'].forEach(env => [20, 40].forEach(years => {
      const P = Object.assign({}, H[ENVN[env]], {years, nAgents: 500}), R = rows(H, P), by = {}; R.forEach(([n, c]) => { by[n] = c; });
      R.forEach(([n, c]) => { const d = n.split('.')[0], ref = by[d === 'none' ? 'none.off' : d + '.off'], same = strip(c) === strip(ref) && ref.sn.rep === true && !ref.eh && !ref.sn.cdc;
        if (!same) ok = false; if (!same || (env === 'ref' && years === 20)) console.log(env + ' ' + years + 'y ' + n + ': ' + (same ? 'the release row with ' + JSON.stringify({eh: c.eh, cdc: c.sn.cdc, taxTake: c.sn.taxTake}) : 'DIFFERS beyond the options')); });
      if (!(by['c22.off'].sp && by['c22.off'].sp.vAt === 'sale' && by['rel.off'].sp.vAt === 'sale' && !(by['none.off'].sp && by['none.off'].sp.vAt))) { ok = false; console.log('the price rule is not at the sale'); }
    }));
  } finally { S.restore(); }
  console.log(ok ? 'check passed: ' + NAMES.length + ' rows per environment and horizon' : 'check FAILED');
  process.exit(ok ? 0 : 1);
}
const env = arg('env', ''), years = +arg('years', 0), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
if (!ENVN[env] || ![20, 40].includes(years) || !m || !out || !Number.isInteger(procs) || procs < 1) {
  console.error('usage: s100.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now();
const rm = /^(\d+)-(\d+)$/.exec(arg('rows', '0-' + (NAMES.length - 1))), r0 = +rm[1], r1 = Math.min(NAMES.length - 1, +rm[2]);
const pass = process.argv.filter(x => /^--(env|years|seeds)=/.test(x));
const cmd = 'node runner/jobs/s100.js --env=' + env + ' --years=' + years + ' --seeds=' + lo + '-' + hi;
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
    console.error('s100 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = engine(), S = H.startRelease({baseline: {env: BASE_ENV[env]}});
  const res = {_meta: {what: 'S100: pay by household type and the child and dependent care credit in the yardstick (research-update prereg/2026-11-s100-part-time-dcc.md): per-seed values of every key, every row',
    env, years, adults: 500, seeds: [lo, hi], rowsRun: [r0, r1], rowNames: NAMES, keys: 'all', digits: 'full',
    manifest: H.runManifest(), baseline: S.baseline, command: cmd + (r0 === 0 && r1 === NAMES.length - 1 ? '' : ' --rows=' + r0 + '-' + r1)}, rows: {}};
  const tRow = [];
  try {
    const P = Object.assign({}, H[ENVN[env]], {years, nAgents: 500}), R = rows(H, P);
    for (let i = r0; i <= r1; i++) { const t1 = Date.now(), X = H.tbStudy([R[i][1]], hi, P, H.r2MainStudy(), lo);
      res.rows[env + '.' + R[i][0]] = values(X[0]._s); tRow.push(+((Date.now() - t1)/1000/(hi - lo + 1)).toFixed(3)); }
  } finally { S.restore(); }
  const sorted = {}; Object.keys(res.rows).sort().forEach(n => { sorted[n] = res.rows[n]; }); res.rows = sorted;  /* the same bytes with or without --procs */
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(S.withSettings(res)));
  const secs = (Date.now() - t0)/1000, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, years, seeds: hi - lo + 1, rows: r1 - r0 + 1, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(2), rowSeconds: tRow, peakRssMB: rss, node: process.version}));
  console.error('s100 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ' rows ' + r0 + '-' + r1 + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
