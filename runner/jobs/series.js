#!/usr/bin/env node
/* S47 (Nov 6, 2026; research-update prereg/run-manifest.md, job X): the per-year visual series (ledger I1, plan step S11), run by the run-study workflow.
 * node dev/tools/explore_export.js ENV YEARS N 1 --v54 --snab --slope --suite [--frozen] runs no programme, the C2.2 design and the release design on seeds
 * 1..N in one process (it averages over them), so the workflow's shard I (its "seed range" I-I, I = 1 .. environments x horizons) runs one environment and
 * horizon (ref, adv, st, each 20 then 40 years; the workflow: seeds 1-6, shards 6); --n is its seed count. The check against the
 * frozen panel (--panel=FILE) is made afterwards, when the R-panel job's merged panel exists: explore_export.js ... --panel=FILE on the same commit.
 *   node RESULTS/runner/jobs/series.js [--env=all|ref|adv|st] [--years=20,40] --n=500 [--frozen] --seeds=I-I --out=FILE
 * Run in an engine checkout (a clean worktree of the pinned commit). FILE is explore_export's JSON with _meta.seeds = [I, I] (the shard), _meta.env, _meta.years and _meta.seriesSeeds = N. */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const ENVS = arg('env', 'all') === 'all' ? ['ref', 'adv', 'st'] : [arg('env', '')], YRS = arg('years', '20,40').split(',').map(Number), n = +arg('n', 0);
const m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), FRZ = process.argv.includes('--frozen'), NS = ENVS.length*YRS.length;
if (!ENVS.every(e => ['ref', 'adv', 'st'].includes(e)) || !YRS.every(y => [20, 40].includes(y)) || !(n >= 1) || !m || m[1] !== m[2] || +m[1] < 1 || +m[1] > NS || !out) {
  console.error('usage: series.js [--env=all|ref|adv|st] [--years=20,40] --n=N [--frozen] --seeds=I-I --out=FILE   (I in 1..environments x horizons)'); process.exit(1); }
const S = +m[1] - 1, env = ENVS[Math.floor(S/YRS.length)], years = YRS[S % YRS.length];  /* shard I: environment, then horizon */
const t0 = Date.now(), tmp = path.resolve(out).replace(/\.json$/, '') + '.series.json';
const a = [path.join(process.cwd(), 'dev', 'tools', 'explore_export.js'), env, String(years), String(n), '1', '--v54', '--snab', '--slope', '--suite'].concat(FRZ ? ['--frozen'] : [], ['--out=' + tmp]);
const r = cp.spawnSync(process.execPath, a, {stdio: ['ignore', 2, 2]});
if (r.status !== 0) { console.error('explore_export exited ' + r.status); process.exit(1); }
const d = JSON.parse(fs.readFileSync(tmp, 'utf8')); fs.unlinkSync(tmp);
d._meta = d._meta || {}; d._meta.seeds = [S + 1, S + 1]; d._meta.env = env; d._meta.years = years; d._meta.seriesSeeds = n;
d._meta.jobCommand = 'node runner/jobs/series.js --env=' + ENVS.join(',') + ' --years=' + YRS.join(',') + ' --n=' + n + (FRZ ? ' --frozen' : '') + ' --seeds=' + (S + 1) + '-' + (S + 1);
fs.writeFileSync(out, JSON.stringify(d));
const secs = (Date.now() - t0)/1000;
fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({job: 'series', env, years, n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: null, node: process.version}));
console.error('series ' + env + ' ' + years + ' years, ' + n + ' seeds: ' + secs.toFixed(1) + ' s');
