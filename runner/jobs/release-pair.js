#!/usr/bin/env node
/* S33 (Oct 30, 2026): the study runner's reference job. Runs the release testbed's main row and its no-programme pair (relMainCfgs, with today's safety net,
 * SNAP's work rule and the slope reading: the release panel's --v54 --snab --slope) on a range of seeds, and writes every seed's value of every measure.
 * Seeds are paired and independent, so any split of 1..N into ranges joins to the same numbers (tbStudy keeps one value per seed).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/release-pair.js --env=ref|adv|st --seeds=A-B --out=FILE [--adults=500] [--years=20]
 * FILE holds only deterministic content (no clock, no machine), so the same seeds give the same bytes anywhere. Seconds and memory go to stderr and to FILE without .json plus .timing.json. */
const fs = require('fs'), path = require('path');
const H = require(path.join(process.cwd(), 'harness.js'));
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const env = arg('env', 'ref'), NAME = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'}[env];
const m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), adults = +arg('adults', 500), years = +arg('years', 20);
if (!NAME || !m || !out || !(adults > 0) || !(years > 0)) { console.error('usage: release-pair.js --env=ref|adv|st --seeds=A-B --out=FILE [--adults=500] [--years=20]'); process.exit(1); }
const lo = +m[1], hi = +m[2], SN = {abawd: true, slope: true}, SC = H.SPEND_SOURCED, t0 = Date.now();
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
