#!/usr/bin/env node
/* S47 (Nov 6, 2026; research-update prereg/run-manifest.md, job R-panel): the release panel in the page's format, run by the run-study workflow.
 * The panel (node harness.js testbed N release ENV --v54 --snab --slope [--years=40] [--frozen]) averages each row over seeds 1..N inside one process, so
 * it cannot be cut by seeds. It is cut by rows instead (--part=I/K, harness.js; dev/tools/merge_parts.py joins the pieces, then merge_panel.py the
 * environments). The workflow's shard I (its "seed range" I-I, I = 1 .. environments x horizons x K) runs one environment, horizon and piece: environments in
 * the order ref, adv, st, then horizons, then pieces 0..K-1. --n is the panel's seed count (seeds 1..N in every piece).
 *   node RESULTS/runner/jobs/panel.js [--env=all|ref|adv|st] [--years=20,40] --n=500 --parts=K [--frozen] --seeds=I-I --out=FILE
 *   (the workflow: seeds 1-(6K), shards 6K, job_args "--n=500 --parts=K [--frozen]")
 * Run in an engine checkout (a clean worktree of the pinned commit). FILE is the testbed's JSON with _meta.seeds = [I, I] (the shard), _meta.panelSeeds = N
 * and _meta.part (from the testbed); FILE without .json plus .timing.json holds seconds and memory. --frozen: every row of the panel on the frozen engine
 * and the C2.2 design as row c22 (harness.js testbed --frozen). */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const ENVS = arg('env', 'all') === 'all' ? ['ref', 'adv', 'st'] : [arg('env', '')], YRS = arg('years', '20,40').split(',').map(Number), n = +arg('n', 0), K = +arg('parts', 1);
const m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), FRZ = process.argv.includes('--frozen'), NS = ENVS.length*YRS.length*K;
if (!ENVS.every(e => ['ref', 'adv', 'st'].includes(e)) || !YRS.every(y => [20, 40].includes(y)) || !(n >= 1) || !(K >= 1) || !m || m[1] !== m[2] || +m[1] < 1 || +m[1] > NS || !out) {
  console.error('usage: panel.js [--env=all|ref|adv|st] [--years=20,40] --n=N --parts=K [--frozen] --seeds=I-I --out=FILE   (I in 1..environments x horizons x K)'); process.exit(1); }
const S = +m[1] - 1, env = ENVS[Math.floor(S/(YRS.length*K))], years = YRS[Math.floor(S/K) % YRS.length], P = S % K;  /* shard I: environment, horizon, piece */
const I = P + 1, t0 = Date.now(), tmp = path.resolve(out).replace(/\.json$/, '') + '.testbed.json';
const a = [path.join(process.cwd(), 'harness.js'), 'testbed', String(n), 'release', env, '--v54', '--snab', '--slope'].concat(years === 40 ? ['--years=40'] : [], FRZ ? ['--frozen'] : [], ['--part=' + (I - 1) + '/' + K, '--json=' + tmp]);
const r = cp.spawnSync(process.execPath, a, {stdio: ['ignore', 2, 2]});
if (r.status !== 0) { console.error('testbed exited ' + r.status); process.exit(1); }
const d = JSON.parse(fs.readFileSync(tmp, 'utf8')); fs.unlinkSync(tmp);
d._meta.seeds = [S + 1, S + 1]; d._meta.panelSeeds = n; d._meta.shard = 'piece ' + (I - 1) + ' of ' + K + ' (--part=' + (I - 1) + '/' + K + ')';
d._meta.jobCommand = 'node runner/jobs/panel.js --env=' + ENVS.join(',') + ' --years=' + YRS.join(',') + ' --n=' + n + ' --parts=' + K + (FRZ ? ' --frozen' : '') + ' --seeds=' + (S + 1) + '-' + (S + 1);
fs.writeFileSync(out, JSON.stringify(d));
const secs = (Date.now() - t0)/1000, rss = 0;
fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({job: 'panel', env, years, n, part: [I - 1, K], seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss || null, node: process.version}));
console.error('panel ' + env + ' ' + years + ' years, ' + n + ' seeds, piece ' + (I - 1) + '/' + K + ': ' + secs.toFixed(1) + ' s');
