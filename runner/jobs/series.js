#!/usr/bin/env node
/* S47 (Nov 6, 2026; research-update prereg/run-manifest.md, job X): the per-year visual series (ledger I1, plan step S11), run by the run-study workflow.
 * node dev/tools/explore_export.js ENV YEARS N 1 --v54 --snab --slope --suite [--frozen] runs no programme, the C2.2 design and the release design on seeds
 * 1..N in one process (it averages over them), so the workflow runs it as one shard (seed range 1-1); --n is its seed count. The check against the
 * frozen panel (--panel=FILE) is made afterwards, when the R-panel job's merged panel exists: explore_export.js ... --panel=FILE on the same commit.
 *   node RESULTS/runner/jobs/series.js --env=ref|adv|st --years=20|40 --n=500 [--frozen] --seeds=1-1 --out=FILE
 * Run in an engine checkout (a clean worktree of the pinned commit). FILE is explore_export's JSON with _meta.seeds = [1, 1] (the shard) and _meta.seriesSeeds = N. */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const env = arg('env', ''), years = +arg('years', 20), n = +arg('n', 0), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), FRZ = process.argv.includes('--frozen');
if (!['ref', 'adv', 'st'].includes(env) || ![20, 40].includes(years) || !(n >= 1) || !m || m[1] !== '1' || m[2] !== '1' || !out) {
  console.error('usage: series.js --env=ref|adv|st --years=20|40 --n=N [--frozen] --seeds=1-1 --out=FILE'); process.exit(1); }
const t0 = Date.now(), tmp = path.resolve(out).replace(/\.json$/, '') + '.series.json';
const a = [path.join(process.cwd(), 'dev', 'tools', 'explore_export.js'), env, String(years), String(n), '1', '--v54', '--snab', '--slope', '--suite'].concat(FRZ ? ['--frozen'] : [], ['--out=' + tmp]);
const r = cp.spawnSync(process.execPath, a, {stdio: ['ignore', 2, 2]});
if (r.status !== 0) { console.error('explore_export exited ' + r.status); process.exit(1); }
const d = JSON.parse(fs.readFileSync(tmp, 'utf8')); fs.unlinkSync(tmp);
d._meta = d._meta || {}; d._meta.seeds = [1, 1]; d._meta.seriesSeeds = n;
d._meta.jobCommand = 'node runner/jobs/series.js --env=' + env + ' --years=' + years + ' --n=' + n + (FRZ ? ' --frozen' : '') + ' --seeds=1-1';
fs.writeFileSync(out, JSON.stringify(d));
const secs = (Date.now() - t0)/1000;
fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({job: 'series', env, years, n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: null, node: process.version}));
console.error('series ' + env + ' ' + years + ' years, ' + n + ' seeds: ' + secs.toFixed(1) + ' s');
