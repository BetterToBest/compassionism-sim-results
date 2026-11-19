#!/usr/bin/env node
/* S92 (Nov 19, 2026): the v5.9 main rows rerun with the private businesses' BU price at the sale, as preregistered in research-update
 * prereg/2026-11-s90-private-price-at-sale.md (engine b8ccd8d, which adds the row option sp.vAt 'sale'; off by default). This script changes no engine line.
 *
 * Rows per environment and horizon (prereg Design, "Rows"): the main rows as r2.js --part=M builds them (harness.js r2FreezePair, untouched):
 *   none       the no-programme run (has no surplus split, so it does not read the option; run once)
 *   c22        the full-coverage design, lagged (the published setting)
 *   rel        the opt-in design, lagged
 *   c22.sale   c22 with sp: Object.assign({}, row.sp, {vAt: 'sale'})
 *   rel.sale   rel with the same
 * The financed rows of part M are not in this study (they are among the other reached studies of decision rule 5).
 * Row names are <env>.<row>, so none, c22 and rel compare directly with the published r2-m-<env>-<years>-104691f rows (check 1).
 * Outputs: every key the engine reports, at full precision, per seed (as part M). One results folder per environment and horizon:
 * s90-sale-<env>-<years>-<engine 7>.
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/s90.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]
 *   node RESULTS/runner/jobs/s90.js --check      (prints the rows and checks each at-sale row differs from its lagged row only by sp.vAt)
 * Every run first passes the release start's baseline check (startRelease({baseline: true}): the frozen no-programme arm equals the release per seed)
 * and records the effective settings (_settings). --procs=K cuts the rows into K pieces run as K processes and joins them (the same bytes as one process).
 * FILE holds only deterministic content; seconds and memory go to stderr and to FILE without .json plus .timing.json. */
'use strict';
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', str: 'STRESS_TEST'}, BASE_ENV = {ref: 'ref', adv: 'adv', str: 'st'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const NAMES = ['none', 'c22', 'rel', 'c22.sale', 'rel.sale'];
const engine = () => require(path.join(process.cwd(), 'harness.js'));

/* the rows: [name, cfg] */
function rows(H, P) {
  const M = H.r2FreezePair(P, 'c22'), R = H.r2FreezePair(P, 'rel')[1];
  /* each at-sale row is a fresh copy of its lagged row (its own r2FreezePair call, so no object is shared with the lagged row), with only sp.vAt set */
  const sale = c => { c.sp = Object.assign({}, c.sp, {vAt: 'sale'}); return c; };
  const out = [['none', M[0]], ['c22', M[1]], ['rel', R], ['c22.sale', sale(H.r2FreezePair(P, 'c22')[1])], ['rel.sale', sale(H.r2FreezePair(P, 'rel')[1])]];
  out.forEach((r, i) => { if (r[0] !== NAMES[i]) throw new Error('row order'); });
  return out;
}
const full = x => Number.isFinite(x) ? x : null;
const values = s => { const v = {}; Object.keys(s).forEach(k => { v[k] = Array.from(s[k], full); }); return v; };

if (process.argv.includes('--check')) {
  const H = engine(), S = H.startRelease();
  let ok = true;
  try {
    ['ref', 'adv', 'str'].forEach(env => [20, 40].forEach(years => {
      const P = Object.assign({}, H[ENVN[env]], {years, nAgents: 500}), R = rows(H, P), by = {}; R.forEach(([n, c]) => { by[n] = c; });
      ['c22', 'rel'].forEach(n => {
        const a = JSON.parse(JSON.stringify(by[n])), b = JSON.parse(JSON.stringify(by[n + '.sale']));
        const vb = b.sp && b.sp.vAt; if (b.sp) delete b.sp.vAt; if (a.sp) delete a.sp.vAt;
        if (a.sp && !Object.keys(a.sp).length) delete a.sp; if (b.sp && !Object.keys(b.sp).length) delete b.sp;
        const same = JSON.stringify(a) === JSON.stringify(b) && vb === 'sale' && !(by[n].sp && by[n].sp.vAt);
        if (!same) ok = false;
        console.log(env + ' ' + years + 'y ' + n + '.sale: ' + (same ? 'differs from ' + n + ' only by sp.vAt sale' : 'DIFFERS beyond sp.vAt'));
      });
    }));
  } finally { S.restore(); }
  console.log(ok ? 'check passed: ' + NAMES.length + ' rows per environment and horizon' : 'check FAILED');
  process.exit(ok ? 0 : 1);
}

const env = arg('env', ''), years = +arg('years', 0), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
if (!ENVN[env] || ![20, 40].includes(years) || !m || !out || !Number.isInteger(procs) || procs < 1) {
  console.error('usage: s90.js --env=ref|adv|str --years=20|40 --seeds=A-B --out=FILE [--procs=K] [--rows=A-B]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now();
const rm = /^(\d+)-(\d+)$/.exec(arg('rows', '0-' + (NAMES.length - 1))), r0 = +rm[1], r1 = Math.min(NAMES.length - 1, +rm[2]);
const pass = process.argv.filter(x => /^--(env|years|seeds)=/.test(x));
const cmd = 'node runner/jobs/s90.js --env=' + env + ' --years=' + years + ' --seeds=' + lo + '-' + hi;
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
    console.error('s90 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = engine(), S = H.startRelease({baseline: {env: BASE_ENV[env]}});
  const res = {_meta: {what: 'S92: the v5.9 main rows with the private BU price lagged and at the sale (research-update prereg/2026-11-s90-private-price-at-sale.md): per-seed values of every key, every row',
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
  console.error('s90 ' + env + ' ' + years + 'y seeds ' + lo + '-' + hi + ' rows ' + r0 + '-' + r1 + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
