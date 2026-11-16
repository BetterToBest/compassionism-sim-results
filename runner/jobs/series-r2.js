#!/usr/bin/env node
/* S11 (Nov 16, 2026; research-update prereg/2026-11-x2-series-addendum.md, job X2, ledger D30): the visual suite's per-year series for release 2's
 * main row, run by the run-study workflow. Beside series.js (job X, the frozen round-1 rows); this job runs
 *   node dev/tools/explore_export.js ENV YEARS N 1 --r2 --suite --panel=RESULTS/r2-m-ENV-YEARS-104691f/shard-0000.json.gz
 * on seeds 1..N in one process: no programme, the C2.2 design and the release design (harness.js r2FreezePair, as runner/jobs/r2.js part M runs them).
 * The panel is release 2's stored part M shard in THIS repository; explore_export.js stops, and this shard fails, unless every engine output key of
 * every row and seed equals it. The workflow's shard I (its "seed range" I-I, I = 1 .. environments x horizons) runs one environment and horizon
 * (ref, adv, st, each 20 then 40 years; the workflow: seeds 1-6, shards 6); --n is the seed count.
 *   node RESULTS/runner/jobs/series-r2.js [--env=all|ref|adv|st] [--years=20,40] --n=500 --seeds=I-I --out=FILE
 * Run in an engine checkout (a clean checkout of the pinned commit). FILE is explore_export's JSON with _meta.seeds = [I, I] (the shard), _meta.env,
 * _meta.years and _meta.seriesSeeds = N.
 * S79 (Nov 16, 2026; research-update prereg/2026-11-x3-measures-addendum.md, job X3): --study runs explore_export.js with --r2 --study instead of
 * --r2 --suite: the measures study and the BLEI paper's other measures (EDC, FBS, IPBI's public costs avoided) for the same three rows, checked against
 * the same part M shard (every key; only the two reporting switches' own keys are new). Without --study the job is as it was (job X2). */
const fs = require('fs'), path = require('path'), cp = require('child_process');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const ENVS = arg('env', 'all') === 'all' ? ['ref', 'adv', 'st'] : [arg('env', '')], YRS = arg('years', '20,40').split(',').map(Number), n = +arg('n', 0);
const STUDY = process.argv.includes('--study'), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), NS = ENVS.length*YRS.length;
if (!ENVS.every(e => ['ref', 'adv', 'st'].includes(e)) || !YRS.every(y => [20, 40].includes(y)) || !(n >= 1 && n <= 500) || !m || m[1] !== m[2] || +m[1] < 1 || +m[1] > NS || !out) {
  console.error('usage: series-r2.js [--env=all|ref|adv|st] [--years=20,40] --n=N [--study] --seeds=I-I --out=FILE   (N at most 500; I in 1..environments x horizons)'); process.exit(1); }
const S = +m[1] - 1, env = ENVS[Math.floor(S/YRS.length)], years = YRS[S % YRS.length];  /* shard I: environment, then horizon */
const panel = path.join(__dirname, '..', '..', 'r2-m-' + (env === 'st' ? 'str' : env) + '-' + years + '-104691f', 'shard-0000.json.gz');
if (!fs.existsSync(panel)) { console.error('release 2 part M shard not found: ' + panel); process.exit(1); }
const t0 = Date.now(), tmp = path.resolve(out).replace(/\.json$/, '') + '.series.json';
const a = [path.join(process.cwd(), 'dev', 'tools', 'explore_export.js'), env, String(years), String(n), '1', '--r2', STUDY ? '--study' : '--suite', '--panel=' + panel, '--out=' + tmp];
const r = cp.spawnSync(process.execPath, a, {stdio: ['ignore', 2, 2]});
if (r.status !== 0) { console.error('explore_export exited ' + r.status); process.exit(1); }
const d = JSON.parse(fs.readFileSync(tmp, 'utf8')); fs.unlinkSync(tmp);
if (!d._meta || !d._meta.r2 || !d._meta.r2.panelCheck) { console.error('explore_export did not compare with release 2'); process.exit(1); }
d._meta.selfCheck = d._meta.selfCheck.split(panel).join('r2-m-' + (env === 'st' ? 'str' : env) + '-' + years + '-104691f/shard-0000.json.gz');  /* no runner paths in the file */
d._meta.command = d._meta.command.split(panel).join('RESULTS/r2-m-' + (env === 'st' ? 'str' : env) + '-' + years + '-104691f/shard-0000.json.gz').replace(/ --out=\S+/, '');
d._meta.seeds = [S + 1, S + 1]; d._meta.env = env; d._meta.years = years; d._meta.seriesSeeds = n;
d._meta.jobCommand = 'node runner/jobs/series-r2.js --env=' + ENVS.join(',') + ' --years=' + YRS.join(',') + ' --n=' + n + (STUDY ? ' --study' : '') + ' --seeds=' + (S + 1) + '-' + (S + 1);
fs.writeFileSync(out, JSON.stringify(d));
const secs = (Date.now() - t0)/1000;
fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({job: 'series-r2' + (STUDY ? ' --study' : ''), env, years, n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: null, node: process.version}));
console.error('series-r2' + (STUDY ? ' --study ' : ' ') + env + ' ' + years + ' years, ' + n + ' seeds: ' + secs.toFixed(1) + ' s');
