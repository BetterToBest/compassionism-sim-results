#!/usr/bin/env node
/* S33 (Oct 30, 2026): the study runner's reference job. Runs the release testbed's main row and its no-programme pair (relMainCfgs, with today's safety net,
 * SNAP's work rule and the slope reading: the release panel's --v54 --snab --slope) on a range of seeds, and writes every seed's value of every measure.
 * Seeds are paired and independent, so any split of 1..N into ranges joins to the same numbers (tbStudy keeps one value per seed).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/release-pair.js --env=ref|adv|st --seeds=A-B --out=FILE [--adults=500] [--years=20] [--procs=1]
 * --procs=K cuts the range into K contiguous pieces run as K processes at once (a runner has 4 vCPUs) and joins them: the file is byte for byte the one a single process writes.
 * FILE holds only deterministic content (no clock, no machine), so the same seeds give the same bytes anywhere. Seconds and memory go to stderr and to FILE without .json plus .timing.json. */
const fs = require('fs'), path = require('path');
const H = require(path.join(process.cwd(), 'harness.js'));
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const env = arg('env', 'ref'), NAME = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'}[env];
const m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), adults = +arg('adults', 500), years = +arg('years', 20);
const procs = +arg('procs', 1);
if (!NAME || !m || !out || !(adults > 0) || !(years > 0) || !Number.isInteger(procs) || procs < 1) { console.error('usage: release-pair.js --env=ref|adv|st --seeds=A-B --out=FILE [--adults=500] [--years=20] [--procs=1]'); process.exit(1); }
const lo = +m[1], hi = +m[2], SN = {abawd: true, slope: true}, SC = H.SPEND_SOURCED, t0 = Date.now();
if (procs > 1 && hi > lo) {  /* parent: run the pieces as child processes, then join their per-seed arrays in seed order */
  const cp = require('child_process'), k = Math.min(procs, hi - lo + 1), n0 = hi - lo + 1, parts = []; let s0 = lo;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename, '--env=' + env, '--seeds=' + q.from + '-' + q.to, '--out=' + q.file, '--adults=' + adults, '--years=' + years], {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const D = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o = D[0];
    o._meta.seeds = [lo, hi]; o._meta.command = o._meta.command.replace(/--seeds=\d+-\d+/, '--seeds=' + lo + '-' + hi);
    Object.keys(o.rows).forEach(r => Object.keys(o.rows[r]).forEach(key => { o.rows[r][key] = [].concat(...D.map(d => d.rows[r][key])); }));
    fs.writeFileSync(out, JSON.stringify(o));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000, n = hi - lo + 1;
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, seeds: n, adults, years, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error(env + ' seeds ' + lo + '-' + hi + ' adults ' + adults + ' years ' + years + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes (' + (secs/n).toFixed(2) + ' s a seed), largest process ' + Math.max(...T.map(t => t.peakRssMB)) + ' MB');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
const o = {_meta: {what: 'release testbed: main row and its no-programme pair, per-seed values', env, seeds: [lo, hi], adults, years, sn: Object.assign({}, H.SNET_DEFAULTS, SN), manifest: H.runManifest(),
  command: 'node runner/jobs/release-pair.js --env=' + env + ' --seeds=' + lo + '-' + hi + ' --adults=' + adults + ' --years=' + years}, rows: {}};
try {
  const P = Object.assign({}, H[NAME], {years, nAgents: adults}), PR = H.tbPresets(P), so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: SC}, H.REL_V52_STUDY);
  const cfgs = H.relMainCfgs(PR).map(c => Object.assign(c, {sc: SC, sn: SN}));
  const R = H.tbStudy(cfgs, hi, P, so, lo);
  ['none', 'main'].forEach((name, i) => { const r = {}; Object.keys(R[i]._s).forEach(k => { r[k] = Array.from(R[i]._s[k]); }); o.rows[name] = r; });
} finally { H.resetNR6(svN); H.tbSetG(svG); }
fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
fs.writeFileSync(out, JSON.stringify(o));
const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, seeds: n, adults, years, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss, node: process.version}));
console.error(env + ' seeds ' + lo + '-' + hi + ' adults ' + adults + ' years ' + years + ': ' + secs.toFixed(1) + ' s (' + (secs/n).toFixed(2) + ' s a seed), peak memory ' + rss + ' MB');
}
