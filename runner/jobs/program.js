#!/usr/bin/env node
/* S35 (Oct 30, 2026): the study programme's job script (research-update prereg/2026-11-study-program.md, "Studies" and "Before the first run", item 1).
 * It builds exactly the rows of the preregistration's Studies table for one study and runs them on a range of seeds, in one or all three environments.
 * Every row starts from the runner's reference job (release-pair.js): relMainCfgs(tbPresets(P)) with sc SPEND_SOURCED and sn {abawd, slope}, applyNR6(),
 * tbSetG(TB_PROFILE_G), study options {fin: 'tax', aT: 0, a: 0, X: 0, sc} plus REL_V52_STUDY. Element 0 is the none row, element 1 the main row; each switch
 * below changes only what it names (the preregistration's Rows table).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/program.js --study=A|B|B10|C|D|D10|F --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1]
 *     [--sizes=500,2000] [--years=20,40]    (pilots only: a subset of the study's population sizes or horizons; the full batch uses the table's)
 *   node RESULTS/runner/jobs/program.js --check    (the row-count and equality checks; no output file)
 * A block is one environment, population and horizon (one tbStudy call). Rows are named ENV.nADULTS.yYEARS.ROW, where ROW is
 * <yardstick>.<cell or row>[.raise][.pPCT][.age][.debt]: yardstick cps (headline) or rel (released wages); cell CFHZI with upper case for a part that is on
 * (CCO, PTF, PTH, SZH, CIP), main = CFHZI, none = no programme; .raise = the octave wage raise on; .pNN = participation NN%; .age = ageing on; .debt = the
 * debt reading on. Each row holds one value per seed for every measure in KEYS (below). Seeds are paired and independent, so any split of 1..N joins to the
 * same numbers. --procs=K cuts the seeds into K pieces run as K processes and joins them (the same bytes as one process).
 * FILE holds only deterministic content; seconds and memory go to stderr and FILE without .json plus .timing.json. */
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };

/* The studies (preregistration, Studies table). raise: rows with CCO are also run with the raise on. yard: the yardsticks. part: participation grid. */
const STUDY = {
  A: {sizes: [500, 2000, 10000, 50000], years: [20, 40], yard: ['cps', 'rel'], cells: 'pair', raise: true},
  B: {sizes: [500], years: [20, 40], yard: ['cps', 'rel'], cells: 'all', raise: true},
  B10: {sizes: [10000], years: [20], yard: ['cps'], cells: 'all', raise: false},
  C: {sizes: [500], years: [20, 40], yard: ['cps', 'rel'], cells: 'pair', raise: true, age: true},
  D: {sizes: [500], years: [20, 40], yard: ['cps', 'rel'], cells: 'part', raise: true},
  D10: {sizes: [10000], years: [20], yard: ['cps'], cells: 'part', raise: false},
  F: {sizes: [500], years: [20, 40], yard: ['cps', 'rel'], cells: 'pair', raise: true, debt: true}
};
/* Rows per environment in the preregistration's table (summed over horizons where a study runs two: the table counts rows per environment and horizon). */
const PREREG_ROWS = {A: 6, B: 96, B10: 32, C: 6, D: 38, D10: 10, F: 6};
const PARTS = ['C', 'F', 'H', 'Z', 'I'], PKEY = ['ccoOn', 'ptf', 'pth', 'szh', 'cip'];
const cellName = b => PARTS.map((ch, i) => b[i] ? ch : ch.toLowerCase()).join('');
const PGRID = [10, 20, 30, 40, 50, 60, 70, 80, 90];

/* The measures kept per seed: the preregistered outcomes (primary and secondary), the diagnostics beside them, and the new S35 reporting keys
 * (price level at years 20 and 40, families in debt). The full key set (about 700 measures) would make study B about 3.6 GB at 500 seeds. */
const KEYS = ['bNAPy', 'bOAPy', 'bNA20', 'bOA20', 'pbO_19', 'pbO_39', 'fgt0PY', 'pf0_19', 'pf0_39', 'pov', 'ppov_19', 'ppov_39',
  'cost', 'srcPay', 'srcTax', 'pLev10', 'pLev20', 'plv_19', 'plv_39', 'endoAnn',
  'giniD', 'eGiniW', 'hhCostKidPY', 'hrs', 'hhFplPY', 'fgt2PY', 'hhDebt20', 'hhDebt40',
  'gPartF0', 'gNonF0', 'gPartW', 'gNonW', 'gPartRes', 'gNonRes', 'bNPPy', 'bNNPy', 'bOPPy', 'bONPy',
  'jnP5', 'jnP10', 'jnP19', 'emp', 'medWealthReal', 'octMean', 'agRet', 'agAge'];
/* Study C: outcomes by age at joining (computed here from the engine's reporting hook; see ageJoin below). */
const AJ_G = ['j25', 'j35', 'j50', 'j67', 'never'], AJ_M = ['N', 'Y', 'BN', 'F0', 'Pov'];
const AJ_KEYS = ['ajMatch'].concat(...AJ_G.map(g => AJ_M.map(m => 'aj' + m + '_' + g)), ...AJ_G.map(g => ['BN', 'F0', 'Pov'].map(m => 'aj' + m + '0_' + g)));

/* The rows of one block: [name, cfg]. H: the harness; PR: tbPresets(P) for the block's P (participation rows get their own, below). */
function blockRows(H, S, P0) {
  const SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true}, out = [];
  const pair = P => H.relMainCfgs(H.tbPresets(P)).map(c => Object.assign(c, {sc: SC, sn: SN}));
  const yardOf = y => y === 'cps' ? {lt: {s: 'all', m: 'all'}} : {};
  const extra = Object.assign({}, S.age ? {ag: {}} : {}, S.debt ? {dr: {}} : {}), tag = (S.age ? '.age' : '') + (S.debt ? '.debt' : '');
  const add = (name, c, y) => { Object.assign(c, yardOf(y), JSON.parse(JSON.stringify(extra))); out.push([y + '.' + name + tag, c]); };
  const raiseOn = c => { delete c.pw; return c; };
  S.yard.forEach(y => {
    add('none', pair(P0)[0], y);
    if (S.cells === 'pair') { add('main', pair(P0)[1], y); if (S.raise) add('main.raise', raiseOn(pair(P0)[1]), y); }
    if (S.cells === 'all') for (let m = 31; m >= 1; m--) {
      const b = [16, 8, 4, 2, 1].map(x => !!(m & x)), c = pair(P0)[1]; c.p = Object.assign({}, c.p); PKEY.forEach((k, i) => { c.p[k] = b[i]; });
      const nm = m === 31 ? 'main' : cellName(b); add(nm, c, y);
      if (S.raise && b[0]) { const r = pair(P0)[1]; r.p = Object.assign({}, r.p); PKEY.forEach((k, i) => { r.p[k] = b[i]; }); add(nm + '.raise', raiseOn(r), y); }
    }
    if (S.cells === 'part') PGRID.forEach(q => { const Pq = Object.assign({}, P0, {partRate: q/100});
      add('main.p' + q, pair(Pq)[1], y); if (S.raise) add('main.raise.p' + q, raiseOn(pair(Pq)[1]), y); });
  });
  return out;
}

/* Study C, outcomes by age at joining (preregistration, Outcomes, secondary). Groups by the age at which an adult is first seen in the CCO in the main row
 * (25-34, 35-49, 50-66, 67 and over, never joined); over each adult's years from that year on (from year 0 for those never joining; a later leave does not
 * end them), the share of adult-years below 30 days of basic living (design-neutral BLEI), below the cost of living and with wealth below $25,000 (year-0
 * prices), and the same adult-years of the same adults (by the engine's adult id) in the paired none row of the same seed and yardstick. ajN: adults in the
 * group; ajY: their adult-years; ajMatch: % of the main row's adult-years found in the none row (only matched adult-years count in both). Reporting only:
 * the hook reads agents and draws nothing. */
function ageJoinHook(H) {
  const C = H.CFG, st = {cur: null, done: []};
  st.hook = function (agents, yr, T, lf) {
    if (yr === 0) st.cur = new Map();
    const M = st.cur;
    agents.forEach((a, j) => { const id = a._id !== undefined ? a._id : j;
      const bn = (H.agentBLEI(a, 0, false, false, false, 0, false) + (a._tbM || 0)/C.BASE_DAILY_COST)/lf < C.BLEI_PRECARIOUS_MAX;
      let r = M.get(id); if (!r) { r = {jy: -1, ja: 0, y: []}; M.set(id, r); }
      if (r.jy < 0 && a.inCCO) { r.jy = yr; r.ja = a.age; }
      r.y[yr] = [bn ? 1 : 0, (a._tbGap || 0) > 0 ? 1 : 0, a.wealth < C.POVERTY_LINE*lf ? 1 : 0]; });
    if (yr === T - 1) { st.done.push(M); st.cur = null; }
  };
  return st;
}
function ageJoinStats(main, none) {
  const g = {}; AJ_G.forEach(k => { g[k] = {n: 0, y: 0, m: [0, 0, 0], b: [0, 0, 0]}; }); let all = 0, hit = 0;
  main.forEach((r, id) => { const k = r.jy < 0 ? 'never' : r.ja >= 67 ? 'j67' : r.ja >= 50 ? 'j50' : r.ja >= 35 ? 'j35' : 'j25', G = g[k], b = none.get(id);
    let any = false; for (let t = Math.max(0, r.jy); t < r.y.length; t++) { if (!r.y[t]) continue; all++; if (!b || !b.y[t]) continue; hit++; any = true; G.y++;
      for (let i = 0; i < 3; i++) { G.m[i] += r.y[t][i]; G.b[i] += b.y[t][i]; } }
    if (any) G.n++; });
  const o = {ajMatch: all ? hit/all*100 : 0};
  AJ_G.forEach(k => { const G = g[k], pc = x => G.y ? x/G.y*100 : 0; o['ajN_' + k] = G.n; o['ajY_' + k] = G.y;
    ['BN', 'F0', 'Pov'].forEach((m, i) => { o['aj' + m + '_' + k] = pc(G.m[i]); o['aj' + m + '0_' + k] = pc(G.b[i]); }); });
  return o;
}

function runBlock(H, S, env, adults, years, lo, hi) {
  const P = Object.assign({}, H[ENVN[env]], {years, nAgents: adults}), rows = blockRows(H, S, P), SC = H.SPEND_SOURCED;
  const so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: SC}, H.REL_V52_STUDY), cfgs = rows.map(r => r[1]);
  const AJ = S.age ? ageJoinHook(H) : null; if (AJ) H.setRepHook(AJ.hook);
  let R; try { R = H.tbStudy(cfgs, hi, P, so, lo); } finally { if (AJ) H.setRepHook(null); }
  const out = {}, pre = env + '.n' + adults + '.y' + years + '.';
  rows.forEach((r, i) => { const o = {}; KEYS.forEach(k => { if (!R[i]._s[k]) throw new Error('measure ' + k + ' not produced'); o[k] = Array.from(R[i]._s[k]); }); out[pre + r[0]] = o; });
  if (AJ) {  /* runs finish in seed order, then row order (tbStudy); each main row is paired with the none row of its yardstick */
    const nc = cfgs.length; if (AJ.done.length !== (hi - lo + 1)*nc) throw new Error('age-at-joining hook saw ' + AJ.done.length + ' runs, expected ' + (hi - lo + 1)*nc);
    rows.forEach((r, i) => { if (/\.none/.test(r[0])) return; const y = r[0].split('.')[0], ib = rows.findIndex(q => q[0] === y + '.none' + (r[0].slice(r[0].indexOf('.main')).replace(/^\.main(\.raise)?/, '')));
      if (ib < 0) throw new Error('no none row for ' + r[0]);
      const o = out[pre + r[0]]; AJ_KEYS.forEach(k => { o[k] = []; });
      for (let s = 0; s <= hi - lo; s++) { const z = ageJoinStats(AJ.done[s*nc + i], AJ.done[s*nc + ib]); AJ_KEYS.forEach(k => { o[k].push(z[k]); }); } });
  }
  return out;
}

function checks() {
  /* 1. Row counts against the preregistration's Studies table (per environment and horizon). 2. The main and none rows (CPS yardstick off, raise off: the
   * released wages) of study A at 500 adults, 20 years, equal release-pair.js's byte for byte on every kept measure, seeds 1-2, every environment. */
  const H = require(path.join(process.cwd(), 'harness.js')), bad = [];
  Object.keys(STUDY).forEach(s => { const S = STUDY[s], n = blockRows(H, S, Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 60})).length;
    console.log('study ' + s + ': ' + n + ' rows per environment and horizon (preregistration: ' + PREREG_ROWS[s] + ')'); if (n !== PREREG_ROWS[s]) bad.push(s); });
  const cp = require('child_process'), os = require('os'), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prog-'));
  Object.keys(ENVN).forEach(env => {
    cp.execFileSync(process.execPath, [path.join(__dirname, 'release-pair.js'), '--env=' + env, '--seeds=1-2', '--adults=500', '--years=20', '--out=' + path.join(tmp, env + '.json')], {stdio: 'ignore'});
    const ref = JSON.parse(fs.readFileSync(path.join(tmp, env + '.json'), 'utf8')).rows;
    const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G); let mine;
    try { mine = runBlock(H, {yard: ['rel'], cells: 'pair', raise: false}, env, 500, 20, 1, 2); } finally { H.resetNR6(svN); H.tbSetG(svG); }
    ['none', 'main'].forEach(r => { const a = mine[env + '.n500.y20.rel.' + r], b = ref[r], d = KEYS.filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k]));
      console.log(env + ' ' + r + ' row against release-pair.js: ' + (d.length ? 'DIFFERS on ' + d.join(' ') : 'identical on all ' + KEYS.length + ' kept measures'));
      if (d.length) bad.push(env + ' ' + r); }); });
  fs.rmSync(tmp, {recursive: true, force: true});
  if (bad.length) { console.error('CHECKS FAILED: ' + bad.join(', ')); process.exit(1); }
  console.log('checks passed');
}

if (process.argv.includes('--check')) { checks(); return; }
const study = arg('study', ''), envA = arg('env', ''), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1), S = STUDY[study];
const envs = envA === 'all' ? Object.keys(ENVN) : [envA];
if (!S || !envs.every(e => ENVN[e]) || !m || !out || !Number.isInteger(procs) || procs < 1) { console.error('usage: program.js --study=A|B|B10|C|D|D10|F --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1] [--sizes=..] [--years=..]'); process.exit(1); }
const sizes = arg('sizes') ? arg('sizes').split(',').map(Number) : S.sizes, years = arg('years') ? arg('years').split(',').map(Number) : S.years;
if (!sizes.every(x => [500, 2000, 10000, 50000].includes(x)) || !years.every(x => S.years.includes(x))) { console.error('--sizes: among 500, 2000, 10000, 50000; --years: among the study\'s'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now(), pass = ['--study=' + study, '--env=' + envA].concat(arg('sizes') ? ['--sizes=' + arg('sizes')] : [], arg('years') ? ['--years=' + arg('years')] : []);
const command = 'node runner/jobs/program.js ' + pass.join(' ') + ' --seeds=' + lo + '-' + hi;
if (procs > 1 && hi > lo) {  /* parent: run the pieces as child processes, then join their per-seed arrays in seed order */
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
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({study, env: envA, seeds: n, procs: k, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), blocks, node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error('study ' + study + ' ' + envA + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + k + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = require(path.join(process.cwd(), 'harness.js')), svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  const o = {_meta: {what: 'study programme, study ' + study + ' (research-update prereg/2026-11-study-program.md): per-seed values of the kept measures', study, env: envA, seeds: [lo, hi],
    sizes, years, keys: KEYS, sn: Object.assign({}, H.SNET_DEFAULTS, {abawd: true, slope: true}), manifest: H.runManifest(), command}, rows: {}}, blocks = {};
  try {
    envs.forEach(env => sizes.forEach(n => years.forEach(y => { const t1 = Date.now(); Object.assign(o.rows, runBlock(H, S, env, n, y, lo, hi));
      blocks[env + '.n' + n + '.y' + y] = +((Date.now() - t1)/1000).toFixed(2); console.error(env + ' ' + n + ' adults ' + y + ' years: ' + blocks[env + '.n' + n + '.y' + y] + ' s'); })));
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(o));
  const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({study, env: envA, seeds: n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss, blocks, node: process.version}));
  console.error('study ' + study + ' ' + envA + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
