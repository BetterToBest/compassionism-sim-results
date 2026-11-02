#!/usr/bin/env node
/* S52 (Nov 2, 2026): the outside supply-shock study's job script (research-update prereg/2026-11-supply-shock-addendum.md, study O). It builds exactly the
 * addendum's rows and runs them on a range of seeds, in one or all three environments, with the shock layered on each. Every row starts from the runner's
 * reference job (release-pair.js), as the backing study's do: relMainCfgs(tbPresets(P)) with sc SPEND_SOURCED and sn {abawd, slope}, applyNR6(),
 * tbSetG(TB_PROFILE_G), study options {fin: 'tax', aT: 0, a: 0, X: 0, sc} plus REL_V52_STUDY. Each row then changes only what its name says.
 *   DESIGN   rel (the release row as released) or c22 (the C2.2 design, CPS yardstick; its none row is the plain none row with that yardstick)
 *   PATH     off (no shock: size 0, which changes no figure and records the measures) | main (the defaults: rise 0.328 from year 5, 88% kept) | e246, e373, e655 (rise 0.246, 0.373, 0.655) | k51, k100 (kept 0.51, 1)
 *   ROW      none (the no-programme run) | prog (with no shock) | mMM.sSS.kKK.pP: markup share MM%, local sourcing SS%, the shock's reach into local supply KK%,
 *            pooling over P years (the preset key p.sx; index.html SX_DEFAULTS)
 * Rows are named ENV.DESIGN.PATH.ROW. The shock is the environment's: each path runs as its own study, so the no-programme supply path sees the same shock.
 * Each row holds one value per seed for every measure in KEYS. Seeds are paired and independent, so any split of 1..N joins to the same numbers.
 * --procs=K cuts the seeds into K pieces run as K processes and joins them (the same bytes as one process).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/shock.js --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1]
 *   node RESULTS/runner/jobs/shock.js --check      (the row count against the addendum; no output file)
 * FILE holds only deterministic content; seconds and memory go to stderr and FILE without .json plus .timing.json. */
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };

const PATHS = {off: {E: 0}, main: {}, e246: {E: 0.246}, e373: {E: 0.373}, e655: {E: 0.655}, k51: {keep: 0.51}, k100: {keep: 1}};
/* PTF readings under the main path: m x s at kap 50, pool 1 (12); kap 0 at s 25, 50, 100 (3); pool 3 at s 0, 50 (2). Other shocked paths: the main reading and s 50. */
const M_GRID = [0, 25, 50], S_GRID = [0, 25, 50, 100];
const MAIN_PTF = [].concat(...M_GRID.map(m => S_GRID.map(s => [m, s, 50, 1]))).concat([25, 50, 100].map(s => [25, s, 0, 1]), [0, 50].map(s => [25, s, 50, 3]));
const OTHER_PTF = [[25, 0, 50, 1], [25, 50, 50, 1]];
/* per environment and design: none x 7 paths, prog (off) 1, main 17, other shocked paths 5 x 2 = 35; two designs: 70 */
const PREREG_ROWS = 70;
const KEYS = ['fgt0PY', 'bNAPy', 'pov', 'fgt2PY', 'cost', 'cBU', 'srcPay', 'srcM', 'pLev20', 'endoAnn', 'giniD', 'medWealthReal', 'gPartF0', 'gNonF0', 'gPartW', 'gNonW',
  'jnP19', 'pfMem', 'pfCut'];

function rows(H, P, pathName) {
  const SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true}, out = [], sx0 = PATHS[pathName];
  const pair = (d, sx) => H.relMainCfgs(H.tbPresets(P)).map((c, i) => { Object.assign(c, {sc: SC, sn: SN});
    if (d === 'c22'){ c.lt = {s: 'all', m: 'all'}; if (i === 1){ c.c22 = {auto: true, idx: 'needs'}; c.p = Object.assign({}, c.p, {bu: H.c22NeedsBU()}); } }
    if (sx) c.p = Object.assign({}, c.p, {sx: sx}); return c; });
  ['rel', 'c22'].forEach(d => {
    out.push([d + '.' + pathName + '.none', pair(d, sx0)[0]]);
    if (pathName === 'off') { out.push([d + '.off.prog', pair(d, sx0)[1]]); return; }
    (pathName === 'main' ? MAIN_PTF : OTHER_PTF).forEach(([m, s, k, pl]) => {
      const sx = Object.assign({}, sx0, {m: m/100, s: s/100, kap: k/100, pool: pl});
      out.push([d + '.' + pathName + '.m' + m + '.s' + s + '.k' + k + '.p' + pl, pair(d, sx)[1]]); });
  });
  return out;
}
function envFor(H, e, pathName) { const P = Object.assign({}, H[ENVN[e]], {years: 20, nAgents: 500}); if (PATHS[pathName]) P.sx = PATHS[pathName]; return P; }

if (process.argv.includes('--check')) {
  const H = require(path.join(process.cwd(), 'harness.js')), R = [].concat(...Object.keys(PATHS).map(q => rows(H, envFor(H, 'ref', q), q)));
  const names = new Set(R.map(r => r[0])), ok = R.length === PREREG_ROWS && names.size === R.length && typeof H.sxOpts === 'function';
  console.log((ok ? 'PASS' : 'FAIL') + '  rows per environment: ' + R.length + ' (addendum: ' + PREREG_ROWS + '), distinct names: ' + names.size + (typeof H.sxOpts === 'function' ? '' : ', engine has no supply shock'));
  process.exit(ok ? 0 : 1);
}

const env = arg('env', 'ref'), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
const ENVS = env === 'all' ? ['ref', 'adv', 'st'] : [env];
if (!ENVS.every(e => ENVN[e]) || !m || !out || !Number.isInteger(procs) || procs < 1) { console.error('usage: shock.js --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now();
if (procs > 1 && hi > lo) {
  const cp = require('child_process'), k = Math.min(procs, hi - lo + 1), n0 = hi - lo + 1, parts = []; let s0 = lo;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename, '--env=' + env, '--seeds=' + q.from + '-' + q.to, '--out=' + q.file], {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const D = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o = D[0];
    o._meta.seeds = [lo, hi]; o._meta.command = o._meta.command.replace(/--seeds=\d+-\d+/, '--seeds=' + lo + '-' + hi);
    Object.keys(o.rows).forEach(r => Object.keys(o.rows[r]).forEach(key => { o.rows[r][key] = [].concat(...D.map(d => d.rows[r][key])); }));
    fs.writeFileSync(out, JSON.stringify(o));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000, n = hi - lo + 1;
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, seeds: n, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error(env + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = require(path.join(process.cwd(), 'harness.js'));
  const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G), ALLK = KEYS.concat(H.SX_KEYS, H.TB_PLV_KEYS.slice(0, 20));
  const o = {_meta: {what: 'S52 outside supply-shock study (prereg/2026-11-supply-shock-addendum.md): per-seed values', env, seeds: [lo, hi], adults: 500, years: 20, keys: ALLK, manifest: H.runManifest(),
    command: 'node runner/jobs/shock.js --env=' + env + ' --seeds=' + lo + '-' + hi}, rows: {}};
  try {
    ENVS.forEach(e => Object.keys(PATHS).forEach(q => {
      const P = envFor(H, e, q), so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: H.SPEND_SOURCED}, H.REL_V52_STUDY);
      const R0 = rows(H, P, q), R = H.tbStudy(R0.map(r => r[1]), hi, P, so, lo);
      R0.forEach((r, i) => { const v = {}; ALLK.forEach(k => { if (R[i]._s[k]) v[k] = Array.from(R[i]._s[k]); }); o.rows[e + '.' + r[0]] = v; });
    }));
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(o));
  const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, seeds: n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss, node: process.version}));
  console.error(env + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s (' + (secs/n).toFixed(2) + ' s a seed), peak memory ' + rss + ' MB');
}
