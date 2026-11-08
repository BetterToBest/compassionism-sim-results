#!/usr/bin/env node
/* S39 (Nov 8, 2026; research-update prereg/2026-11-s39-outside-crosscheck.md): the outside engine cross-check, BeforeIT.jl with a Basic Unit
 * and conversion module (runner/jobs/beforeit/s39.jl), run by the run-study workflow like every other job.
 *   node RESULTS/runner/jobs/beforeit.js --scale=1000|1 --quarters=80 --reps=5 --seeds=A-B --out=FILE
 * --scale is BeforeIT's population factor on its packaged 1:1000 Austria: 1000 gives one agent per person and firm (full scale), 1 keeps 1:1000.
 * --seeds are run indices (the workflow cuts them into shards): index i is scenario (i-1) div reps on BeforeIT seed (i-1) mod reps + 1 (run.jl).
 * Run in the engine checkout (the frozen engine, ce8d030): the job does not run the engine, but records its manifest, as every shard does; the
 * Basic Unit's sizes come from the engine through runner/jobs/beforeit/shares.json (built by s39-path.js and s39_shares.py, fixed before any run).
 * Julia 1.11.5 is downloaded from julialang.org (checksum checked) unless julia 1.11.5 is already on PATH; the packages are those of the committed
 * Manifest.toml (BeforeIT 0.6.0). FILE holds per-run quarterly series; seconds go to FILE without .json plus .timing.json. */
const fs = require('fs'), path = require('path'), os = require('os'), cp = require('child_process');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const scale = arg('scale', '1000'), Q = arg('quarters', '80'), reps = arg('reps', '5'), [lo, hi] = arg('seeds', '1-1').split('-').map(Number), out = arg('out');
if (!out) throw new Error('--out=FILE');
const DIR = path.join(__dirname, 'beforeit'), JV = '1.11.5', JSHA = '723e878c642220cc0251a0e13758c059a389cadc7f01376feaf1ea7388fe8f9c';
const sh = (c, o) => cp.execSync(c, Object.assign({stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 1 << 30}, o || {})).toString();
const t0 = Date.now();
let julia = 'julia';
try { if (!sh('julia --version').includes(JV)) throw 0; } catch (e) {
  const tmp = process.env.RUNNER_TEMP || os.tmpdir(), tgz = path.join(tmp, 'julia.tgz'), jd = path.join(tmp, 'julia-' + JV);
  if (!fs.existsSync(path.join(jd, 'bin', 'julia'))) {
    sh(`curl -sSfL -o ${tgz} https://julialang-s3.julialang.org/bin/linux/x64/1.11/julia-${JV}-linux-x86_64.tar.gz`);
    const got = sh(`sha256sum ${tgz}`).split(' ')[0]; if (got !== JSHA) throw new Error('julia tarball checksum ' + got);
    fs.mkdirSync(jd, {recursive: true}); sh(`tar xzf ${tgz} -C ${jd} --strip-components=1`);
  }
  julia = path.join(jd, 'bin', 'julia');
}
const env = Object.assign({}, process.env, {JULIA_PKG_SERVER: process.env.JULIA_PKG_SERVER || 'https://pkg.julialang.org'});
sh(`${julia} --project=${DIR} -e "using Pkg; Pkg.instantiate(); Pkg.precompile()"`, {env});
const tmpOut = out + '.raw.json';
sh(`${julia} --project=${DIR} -t 1 ${path.join(DIR, 'run.jl')} ${scale} ${Q} ${reps} ${lo} ${hi} ${path.join(DIR, 'shares.json')} ${tmpOut}`, {env});
const R = JSON.parse(fs.readFileSync(tmpOut, 'utf8')); fs.unlinkSync(tmpOut);
const H = require(path.join(process.cwd(), 'harness.js'));
const keys = Object.keys(R.runs[0].series).sort(), runs = {index: [], scenario: [], seed: []};
keys.forEach(k => { runs[k] = []; });
R.runs.forEach(r => { runs.index.push(r.index); runs.scenario.push(r.scenario); runs.seed.push(r.seed); keys.forEach(k => runs[k].push(r.series[k])); });
const res = {_meta: {what: 'S39 outside cross-check: BeforeIT.jl (Austria 2010Q1) with the Basic Unit and conversion module; quarterly series per run',
  seeds: [lo, hi], indexMeaning: 'run index i: scenario scenarios[(i-1) div reps], BeforeIT seed (i-1) mod reps + 1',
  scenarios: R.scenarios, reps: +reps, scale: R.scale, populationScale: R.scale === 1000 ? '1:1 (full scale)' : '1:' + Math.round(1000/R.scale),
  quarters: R.quarters, julia: R.julia, beforeit: R.beforeit, shares: R.shares_used, manifest: H.runManifest(),
  command: 'node runner/jobs/beforeit.js ' + process.argv.slice(2).join(' ')}, rows: {runs}};
fs.writeFileSync(out, JSON.stringify(res));
const secs = (Date.now() - t0)/1000;
fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({seconds: +secs.toFixed(1), secondsPerSeed: +(secs/(hi - lo + 1)).toFixed(1), peakRssMB: Math.round(process.resourceUsage().maxRSS/1024)}));
console.error('beforeit.js: runs ' + lo + '-' + hi + ' in ' + secs.toFixed(0) + ' s');
