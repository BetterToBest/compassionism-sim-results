#!/usr/bin/env node
/* S53 (Nov 2, 2026): the security-outcomes study's job script (research-update prereg/2026-11-security-addendum.md, study P). It builds exactly the addendum's
 * rows and runs them on a range of seeds, in one or all three environments, with the study option sec on (index.html SEC_DEFAULTS: reporting only, so every
 * other figure is the row's figure without it). Every row starts from the runner's reference job (release-pair.js), as the backing and shock studies' do:
 * relMainCfgs(tbPresets(P)) with sc SPEND_SOURCED and sn {abawd, slope}, applyNR6(), tbSetG(TB_PROFILE_G), study options {fin: 'tax', aT: 0, a: 0, X: 0, sc}
 * plus REL_V52_STUDY and {sec: true}. Each row then changes only what its name says.
 *   DESIGN   rel (the release row as released) or c22 (the C2.2 design, CPS yardstick; its none row is the plain none row with that yardstick)
 *   PATH     off (no outside shock) | main (S52's main supply shock, the preset key p.sx with its defaults; the environment's, so the no-programme run faces it)
 *   ROW      none (the no-programme run) | prog (the design) | none.sv, prog.sv (savings that keep up with prices, row option sv; no shock only; both designs since S47)
 * Rows are named ENV.DESIGN.PATH.ROW. Each row holds one value per seed for every measure in KEYS. Seeds are paired and independent, so any split of 1..N
 * joins to the same numbers. --procs=K cuts the seeds into K pieces run as K processes and joins them (the same bytes as one process).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/security.js --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1]
 *   node RESULTS/runner/jobs/security.js --check      (the row count against the addendum; no output file)
 * FILE holds only deterministic content; seconds and memory go to stderr and FILE without .json plus .timing.json. */
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const FRZ = process.argv.includes('--frozen');  /* S47 (run manifest section 6 item 7): the S48 batch's version: every row, the no-programme rows included, on the frozen engine (harness.js frozenRow: au, fx, the share 0.877) */

const PATHS = {off: null, main: {}};
/* per environment: 2 designs x 2 paths x (none, prog) = 8, plus rel.off.none.sv and rel.off.prog.sv = 10; S47 (addendum Amendment 1): plus c22.off.none.sv and
 * c22.off.prog.sv, the C2.2 design with savings that keep up with prices = 12 */
const PREREG_ROWS = 12;
const KEYS = ['fgt0PY', 'fgt1PY', 'pov', 'bNAPy', 'gPartF0', 'gNonF0', 'gPartW', 'gNonW', 'endoAnn', 'pLev20', 'cost', 'jnP19', 'giniD', 'medWealthReal'];

function rows(H, P, pathName) {
  const SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true}, out = [], sx = PATHS[pathName];
  const pair = (d, sv) => H.relMainCfgs(H.tbPresets(P)).map((c, i) => { Object.assign(c, {sc: SC, sn: SN});
    if (d === 'c22'){ c.lt = {s: 'all', m: 'all'}; if (i === 1){ c.c22 = {auto: true, idx: 'needs'}; c.p = Object.assign({}, c.p, {bu: H.c22NeedsBU()}); } }
    if (sx) c.p = Object.assign({}, c.p, {sx: sx}); if (sv) c.sv = true; return c; });
  ['rel', 'c22'].forEach(d => { const q = pair(d, false); out.push([d + '.' + pathName + '.none', q[0]], [d + '.' + pathName + '.prog', q[1]]); });
  if (pathName === 'off') ['rel', 'c22'].forEach(d => { const q = pair(d, true); out.push([d + '.off.none.sv', q[0]], [d + '.off.prog.sv', q[1]]); });
  return out;
}
function envFor(H, e, pathName) { const P = Object.assign({}, H[ENVN[e]], {years: 20, nAgents: 500}); if (PATHS[pathName]) P.sx = PATHS[pathName]; return P; }

if (process.argv.includes('--check')) {
  const H = require(path.join(process.cwd(), 'harness.js')), R = [].concat(...Object.keys(PATHS).map(q => rows(H, envFor(H, 'ref', q), q)));
  const names = new Set(R.map(r => r[0])), has = Array.isArray(H.SEC_KEYS) && Array.isArray(H.S19_KEYS), ok = R.length === PREREG_ROWS && names.size === R.length && has;
  console.log((ok ? 'PASS' : 'FAIL') + '  rows per environment: ' + R.length + ' (addendum: ' + PREREG_ROWS + '), distinct names: ' + names.size + (has ? '' : ', engine has no security measures'));
  process.exit(ok ? 0 : 1);
}

const env = arg('env', 'ref'), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
const ENVS = env === 'all' ? ['ref', 'adv', 'st'] : [env];
if (!ENVS.every(e => ENVN[e]) || !m || !out || !Number.isInteger(procs) || procs < 1) { console.error('usage: security.js --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1] [--frozen]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now();
if (procs > 1 && hi > lo) {
  const cp = require('child_process'), k = Math.min(procs, hi - lo + 1), n0 = hi - lo + 1, parts = []; let s0 = lo;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename, '--env=' + env, '--seeds=' + q.from + '-' + q.to, '--out=' + q.file].concat(FRZ ? ['--frozen'] : []), {stdio: 'inherit'});
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
  const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G), ALLK = KEYS.concat(H.SEC_KEYS, H.S19_KEYS.filter(k => +k.split('_')[1] < 20));
  const o = {_meta: {what: 'S53 security-outcomes study (prereg/2026-11-security-addendum.md): per-seed values', env, seeds: [lo, hi], adults: 500, years: 20, keys: ALLK, manifest: H.runManifest(), frozen: FRZ ? H.FROZEN : null,
    command: 'node runner/jobs/security.js --env=' + env + ' --seeds=' + lo + '-' + hi + (FRZ ? ' --frozen' : '')}, rows: {}};
  try {
    ENVS.forEach(e => Object.keys(PATHS).forEach(q => {
      const P = envFor(H, e, q), so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: H.SPEND_SOURCED}, H.REL_V52_STUDY, {sec: true});
      const R0 = rows(H, P, q), R = H.tbStudy(R0.map(r => FRZ ? H.frozenRow(r[1]) : r[1]), hi, P, so, lo);
      R0.forEach((r, i) => { const v = {}; ALLK.forEach(k => { if (R[i]._s[k]) v[k] = Array.from(R[i]._s[k]); }); o.rows[e + '.' + r[0]] = v; });
    }));
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(o));
  const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({env, seeds: n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss, node: process.version}));
  console.error(env + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s (' + (secs/n).toFixed(2) + ' s a seed), peak memory ' + rss + ' MB');
}
