#!/usr/bin/env node
/* S14 (Oct 31, 2026): the population-weighted cost-of-living line, run beside the current line (study L; research-update prereg/2026-11-lw-weighted-line.md,
 * "Rows" and "Studies"). Every row starts from the study programme's reference pair as c22.js does (program.js, blockRows): relMainCfgs(tbPresets(P)) with sc
 * SPEND_SOURCED and sn {abawd, slope}, applyNR6(), tbSetG(TB_PROFILE_G), study options {fin: 'tax', aT: 0, a: 0, X: 0, sc} plus REL_V52_STUDY, the octave
 * raise off (as released), CPS earnings yardstick (the headline). Each row changes only what it names: the line, through the engine's switch LW (row option
 * lw; engine pull request 56), and for the C2.2 rows the switch C22 and the BU level, set to the C2.2 needs at that row's line.
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/lw.js --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1] [--years=20,40]
 *   node RESULTS/runner/jobs/lw.js --check    (the row count and equality checks; no output file)
 * Rows are named ENV.n500.yYEARS.<line>.<row>. FILE holds only deterministic content; seconds go to stderr and FILE without .json plus .timing.json.
 * Seeds are paired and independent, so any split of 1..N joins to the same numbers. */
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const YEARS = [20, 40], ADULTS = 500;
/* The lines (preregistration, Rows): base = the engine's line, $49,369.82 (no lw option); ext and bea = keys of the engine's CFG.LW_SETS. */
const LINES = ['base', 'ext', 'bea'];
/* The rows at each line: [name, c22 option or null, BU at the C2.2 needs of the row's line]. */
const ROWS = [['none', null, false], ['main', null, false], ['c22', {auto: true, idx: 'needs'}, true]];
const KEYS = ['bNAPy', 'bOAPy', 'bNA20', 'bOA20', 'pbO_19', 'pbO_39', 'fgt0PY', 'pf0_19', 'pf0_39', 'pov', 'ppov_19', 'ppov_39',
  'cost', 'srcPay', 'srcTax', 'pLev10', 'pLev20', 'plv_19', 'plv_39', 'endoAnn',
  'giniD', 'eGiniW', 'hhCostKidPY', 'hrs', 'hhFplPY', 'fgt2PY', 'hhDebt20', 'hhDebt40',
  'gPartF0', 'gNonF0', 'gPartW', 'gNonW', 'gPartRes', 'gNonRes', 'jnP5', 'jnP10', 'jnP19', 'emp', 'medWealthReal', 'octMean',
  'hhCostPY', 'hhWlthPY', 'hhWlthEnd'];  /* S14: the household readings, which follow the line (pov is the adult $25,000 line, which does not) */

function needsAt(H, line) { const sv = H.lwSet(line === 'base' ? null : line); try { return H.c22NeedsBU(); } finally { H.lwReset(sv); } }

function blockRows(H, P0) {
  const SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true}, out = [], keys = KEYS.concat(H.C22_KEYS);
  const pair = () => H.relMainCfgs(H.tbPresets(P0)).map(c => Object.assign(c, {sc: SC, sn: SN, lt: {s: 'all', m: 'all'}}));
  LINES.forEach(line => ROWS.forEach(([nm, c22, needs]) => {
    const c = pair()[nm === 'none' ? 0 : 1];
    if (line !== 'base') c.lw = line;
    c.c22 = Object.assign({}, c22 || {});
    if (needs) c.p = Object.assign({}, c.p, {bu: needsAt(H, line)});
    out.push([line + '.' + nm, c]);
  }));
  return {rows: out, keys};
}

function runBlock(H, env, years, lo, hi) {
  const P = Object.assign({}, H[ENVN[env]], {years, nAgents: ADULTS}), B = blockRows(H, P), SC = H.SPEND_SOURCED;
  const so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: SC}, H.REL_V52_STUDY);
  const R = H.tbStudy(B.rows.map(r => r[1]), hi, P, so, lo), out = {}, pre = env + '.n' + ADULTS + '.y' + years + '.';
  B.rows.forEach((r, i) => { const o = {}; B.keys.forEach(k => { if (!R[i]._s[k]) throw new Error('measure ' + k + ' not produced in ' + r[0]); o[k] = Array.from(R[i]._s[k]); }); out[pre + r[0]] = o; });
  return out;
}

function checks() {
  /* 1. 9 rows. 2. The C2.2 rows carry the needs level at their own line, and the three levels differ. 3. Seeds 1-2, every environment, 20 years: the base
   * rows equal c22.js's plain pair (no lw option, c22 switch on with nothing set) on every kept measure, and a weighted row run first does not change
   * the base rows run after it. No outcome value is printed. */
  const H = require(path.join(process.cwd(), 'harness.js')), bad = [];
  const P0 = Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 60}), B = blockRows(H, P0);
  console.log('rows: ' + B.rows.length + ' (preregistration: 9)'); if (B.rows.length !== 9) bad.push('row count');
  const lv = LINES.map(l => needsAt(H, l)), nb = B.rows.filter(r => /\.c22$/.test(r[0])).filter(r => Math.abs(r[1].p.bu - lv[LINES.indexOf(r[0].split('.')[0])]) > 1e-9);
  console.log('needs levels carried: ' + (nb.length ? 'NO' : 'yes') + '; distinct: ' + (new Set(lv.map(x => x.toFixed(6))).size === 3 ? 'yes' : 'NO'));
  if (nb.length || new Set(lv.map(x => x.toFixed(6))).size !== 3) bad.push('needs levels');
  const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  try {
    Object.keys(ENVN).forEach(env => {
      const P = Object.assign({}, H[ENVN[env]], {years: 20, nAgents: ADULTS}), SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true};
      const pr = () => H.relMainCfgs(H.tbPresets(P)).map(c => Object.assign(c, {sc: SC, sn: SN, lt: {s: 'all', m: 'all'}}));
      const so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: SC}, H.REL_V52_STUDY), mine = blockRows(H, P).rows.map(r => r[1]);
      const R = H.tbStudy([mine[4], pr()[0], pr()[1], mine[0], mine[1]], 2, P, so, 1);
      [[1, 3, 'base none against the plain none row'], [2, 4, 'base main against the plain main row']].forEach(([a, b, nm]) => {
        const d = KEYS.filter(k => JSON.stringify(Array.from(R[a]._s[k])) !== JSON.stringify(Array.from(R[b]._s[k])));
        console.log(env + ' ' + nm + ' (after a row at another line): ' + (d.length ? 'DIFFERS on ' + d.join(' ') : 'identical on all ' + KEYS.length + ' kept measures')); if (d.length) bad.push(env + ' ' + nm); });
      const m = KEYS.filter(k => JSON.stringify(Array.from(R[0]._s[k])) !== JSON.stringify(Array.from(R[4]._s[k])));
      console.log(env + ' ext main differs from base main on ' + m.length + ' of ' + KEYS.length + ' measures'); if (!m.length) bad.push(env + ' the line moved nothing');
    });
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  if (bad.length) { console.error('CHECKS FAILED: ' + bad.join(', ')); process.exit(1); }
  console.log('checks passed');
}

if (process.argv.includes('--check')) { checks(); return; }
const envA = arg('env', ''), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
const envs = envA === 'all' ? Object.keys(ENVN) : [envA], years = arg('years') ? arg('years').split(',').map(Number) : YEARS;
if (!envs.every(e => ENVN[e]) || !m || !out || !Number.isInteger(procs) || procs < 1 || !years.every(y => YEARS.includes(y))) { console.error('usage: lw.js --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1] [--years=20,40]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now(), pass = ['--env=' + envA].concat(arg('years') ? ['--years=' + arg('years')] : []);
const command = 'node runner/jobs/lw.js ' + pass.join(' ') + ' --seeds=' + lo + '-' + hi;
if (procs > 1 && hi > lo) {  /* parent: run the pieces as child processes, then join their per-seed arrays in seed order (as program.js) */
  const cp = require('child_process'), k = Math.min(procs, hi - lo + 1), n0 = hi - lo + 1, parts = []; let s0 = lo;
  for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + i + '.json'}); s0 += c; }
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename].concat(pass, ['--seeds=' + q.from + '-' + q.to, '--out=' + q.file]), {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const D = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o = D[0];
    o._meta.seeds = [lo, hi]; o._meta.command = command;
    Object.keys(o.rows).forEach(r => Object.keys(o.rows[r]).forEach(key => { o.rows[r][key] = [].concat(...D.map(d => d.rows[r][key])); }));
    fs.writeFileSync(out, JSON.stringify(o));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000, n = hi - lo + 1;
    const blocks = {}; T.forEach(t => Object.keys(t.blocks).forEach(b => { blocks[b] = Math.max(blocks[b] || 0, t.blocks[b]); }));
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({study: 'lw', env: envA, seeds: n, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), blocks, node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error('lw ' + envA + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = require(path.join(process.cwd(), 'harness.js')), svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  const o = {_meta: {what: 'The cost-of-living line, weighted and current (research-update prereg/2026-11-lw-weighted-line.md): per-seed values of the kept measures', study: 'lw', env: envA,
    seeds: [lo, hi], adults: ADULTS, years, keys: KEYS.concat(H.C22_KEYS), lines: LINES.map(l => ({line: l, set: l === 'base' ? null : H.CFG.LW_SETS[l], needsBU: needsAt(H, l)})), rows: ROWS.map(r => ({row: r[0], c22: r[1], needs: r[2]})),
    sn: Object.assign({}, H.SNET_DEFAULTS, {abawd: true, slope: true}), manifest: H.runManifest(), command}, rows: {}}, blocks = {};
  try {
    envs.forEach(env => years.forEach(y => { const t1 = Date.now(); Object.assign(o.rows, runBlock(H, env, y, lo, hi));
      blocks[env + '.n' + ADULTS + '.y' + y] = +((Date.now() - t1)/1000).toFixed(2); console.error(env + ' ' + y + ' years: ' + blocks[env + '.n' + ADULTS + '.y' + y] + ' s'); }));
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(o));
  const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({study: 'lw', env: envA, seeds: n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss, blocks, node: process.version}));
  console.error('lw ' + envA + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
