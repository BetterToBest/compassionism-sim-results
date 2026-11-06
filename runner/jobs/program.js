#!/usr/bin/env node
/* S35 (Oct 30, 2026): the study programme's job script (research-update prereg/2026-11-study-program.md, "Studies" and "Before the first run", item 1).
 * It builds exactly the rows of the preregistration's Studies table for one study and runs them on a range of seeds, in one or all three environments.
 * Every row starts from the runner's reference job (release-pair.js): relMainCfgs(tbPresets(P)) with sc SPEND_SOURCED and sn {abawd, slope}, applyNR6(),
 * tbSetG(TB_PROFILE_G), study options {fin: 'tax', aT: 0, a: 0, X: 0, sc} plus REL_V52_STUDY. Element 0 is the none row, element 1 the main row; each switch
 * below changes only what it names (the preregistration's Rows table).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/program.js --study=R|A|B|B10|C|D|D10|F|G|G10|H|I|J --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1]
 *     [--sizes=500,2000] [--years=20,40]    (pilots only: a subset of the study's population sizes or horizons; the full batch uses the table's)
 *   node RESULTS/runner/jobs/program.js --check    (the row-count and equality checks; no output file)
 * A block is one environment, population and horizon (one tbStudy call). Rows are named ENV.nADULTS.yYEARS.ROW, where ROW is
 * <yardstick>.<cell or row>[.raise][.pPCT][.age][.debt]: yardstick cps (headline) or rel (released wages); cell CFHZI with upper case for a part that is on
 * (CCO, PTF, PTH, SZH, CIP), main = CFHZI, none = no programme; .raise = the octave wage raise on; .pNN = participation NN%; .age = ageing on; .debt = the
 * debt reading on. Each row holds one value per seed for every measure in KEYS (below). Seeds are paired and independent, so any split of 1..N joins to the
 * same numbers. --procs=K cuts the seeds into K pieces run as K processes and joins them (the same bytes as one process).
 * FILE holds only deterministic content; seconds and memory go to stderr and FILE without .json plus .timing.json.
 *
 * S47 (Nov 6, 2026; research-update prereg/run-manifest.md sections 4-6, study programme Amendments 9 and 10, community addendum Amendment 1): the full
 * batch's version. Every row runs on the frozen engine (harness.js frozenRow: au, fx and the spending share 0.877), the no-programme rows included, except
 * study R's published-engine and audit-only rows. Each study's programme rows are built on two designs, a row-name segment before the yardstick:
 * c22 (the C2.2 design, harness.js c22Design: automatic, indexed to the needs' prices, the BU at c22NeedsBU(); the headline) and rls (the release design,
 * $1,200 opt-in). D and D10 are the release design only; A at 50,000 adults the C2.2 design only. Rows are then ENV.nADULTS.yYEARS.DESIGN.ROW.
 * Study R (the release panel and bridge, 500 adults, both yardsticks, 20 and 40 years) names its rows ENV.n500.yYEARS.<yardstick>.<engine>.<design>[.<reading>]:
 * engine pub (the published v5.6 engine), au (the audit's corrections only) or frz (frozen); design none, rls or c22; readings mid (aK, middle backing),
 * h1 (every dollar backed, a 1), fbs50 (FBS50 advancement), wout (wages also follow outside inflation), s593 (the frozen engine at the published share 0.593).
 * Studies G, G10, H, I, J (the community and zone layer, c.cl) name the layer's settings: lay (on, main values), f67, f100, k50, k250, pop, zc; I's .s10/.s30/.s50 is
 * PTF's starting share and .off the layer off. Their none rows come from studies B, B10 and A (same engine, same seeds).
 * Missing values are written as null, never 0 (manifest section 5): year-40 keys in 20-year rows; participation keys (jnP*) on none rows; ageing keys
 * without ageing (and the mean octave, octMean, on rows without CCO, where the C2.2 design's automatic receipt would count adults with no BU); S19 series past the run's end; the layer's keys without the layer; C2.2 keys without the C2.2 rules. */
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
  F: {sizes: [500], years: [20, 40], yard: ['cps', 'rel'], cells: 'pair', raise: true, debt: true},
  R: {sizes: [500], years: [20, 40], yard: ['cps', 'rel'], cells: 'R', sec: true},
  G: {sizes: [500], years: [20, 40], yard: ['cps'], cells: 'G', cl: true},
  G10: {sizes: [10000], years: [20], yard: ['cps'], cells: 'G10', cl: true},
  H: {sizes: [500], years: [20, 40], yard: ['cps'], cells: 'H', cl: true},
  I: {sizes: [500], years: [20, 40], yard: ['cps'], cells: 'I', cl: true},
  J: {sizes: [2000, 10000], years: [20, 40], yard: ['cps'], cells: 'J', cl: true}
};
/* Designs per study (run manifest section 4). */
const DESIGNS = s => s === 'D' || s === 'D10' ? ['rls'] : ['c22', 'rls'];
/* Rows per environment, population and horizon (run manifest section 4: the preregistration's rows, built on both designs; D and D10 with the 2% and 5%
 * levels; A at 50,000 adults the C2.2 design only; R 21 rows per yardstick). */
const MANIFEST_ROWS = {A: 12, A50: 6, B: 192, B10: 64, C: 12, D: 46, D10: 12, F: 12, R: 42, G: 36, G10: 32, H: 18, I: 12, J: 2};
const PARTS = ['C', 'F', 'H', 'Z', 'I'], PKEY = ['ccoOn', 'ptf', 'pth', 'szh', 'cip'];
const cellName = b => PARTS.map((ch, i) => b[i] ? ch : ch.toLowerCase()).join('');
const PGRID = [2, 5, 10, 20, 30, 40, 50, 60, 70, 80, 90];  /* S47: 2% and 5% added (Amendment 9) */

/* The measures kept per seed: the preregistered outcomes (primary and secondary), the diagnostics beside them, and the new S35 reporting keys
 * (price level at years 20 and 40, families in debt). The full key set (about 700 measures) would make study B about 3.6 GB at 500 seeds. */
const KEYS = ['bNAPy', 'bOAPy', 'bNA20', 'bOA20', 'pbO_19', 'pbO_39', 'fgt0PY', 'pf0_19', 'pf0_39', 'pov', 'ppov_19', 'ppov_39',
  'cost', 'srcPay', 'srcTax', 'pLev10', 'pLev20', 'plv_19', 'plv_39', 'endoAnn',
  'giniD', 'eGiniW', 'hhCostKidPY', 'hrs', 'hhFplPY', 'fgt2PY', 'hhDebt20', 'hhDebt40',
  'gPartF0', 'gNonF0', 'gPartW', 'gNonW', 'gPartRes', 'gNonRes', 'bNPPy', 'bNNPy', 'bOPPy', 'bONPy',
  'jnP5', 'jnP10', 'jnP19', 'emp', 'medWealthReal', 'octMean', 'agRet', 'agAge',
  'bNAy20', 'bOAy20'];  /* S47: the year-20 basic-living shares (in a 40-year run, the year-20 reading) */
const Y40 = ['pbO_39', 'pf0_39', 'ppov_39', 'plv_39', 'hhDebt40'], PART_K = ['jnP5', 'jnP10', 'jnP19', 'octMean'], AGE_K = ['agRet', 'agAge'];
/* Keys a study adds (manifest section 5): the layer's under cl; R the security outputs (SEC_KEYS), the S19 series to the run's horizon and C2.2's keys. */
const keysFor = (H, S, years) => KEYS.concat(S.cl ? H.CL_KEYS.concat(['pfMem', 'pfCut']) : [],
  S.sec ? H.SEC_KEYS.concat(H.S19_KEYS.filter(k => +k.split('_').pop() < years), H.C22_KEYS) : [], S.sec ? [] : H.C22_KEYS);
/* null, not 0, where a key has no meaning for the row (S35 report section 9 item 2) or is not produced by it (a key the row's switches do not report). */
const nullKey = (k, name, years, S, H) => (years < 40 && Y40.includes(k)) || ((/(^|\.)none($|\.)/.test(name) || /\.c[FfHhZzIi]{4}(\.|$)/.test(name)) && PART_K.includes(k)) || (!S.age && AGE_K.includes(k));
const OPTIONAL = H => new Set([].concat(H.CL_KEYS, ['pfMem', 'pfCut'], H.C22_KEYS, H.SEC_KEYS, H.S19_KEYS));
/* Study C: outcomes by age at joining (computed here from the engine's reporting hook; see ageJoin below). */
const AJ_G = ['j25', 'j35', 'j50', 'j67', 'never'], AJ_M = ['N', 'Y', 'BN', 'F0', 'Pov'];
const AJ_KEYS = ['ajMatch'].concat(...AJ_G.map(g => AJ_M.map(m => 'aj' + m + '_' + g)), ...AJ_G.map(g => ['BN', 'F0', 'Pov'].map(m => 'aj' + m + '0_' + g)));

/* The rows of one block: [name, cfg]. H: the harness; S: the study; P0: the block's P (participation and PTF-share rows get their own, below); study: its id.
 * Every row is frozenRow'd (au, fx, the share 0.877) except study R's pub and au rows; a programme row of the c22 design is c22Design'd after its cell is set. */
function blockRows(H, S, P0, study) {
  const SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true}, out = [];
  const pair0 = P => H.relMainCfgs(H.tbPresets(P)).map(c => Object.assign(c, {sc: SC, sn: SN}));  /* the published engine (release-pair.js) */
  const pair = P => pair0(P).map(c => H.frozenRow(c));
  const yardOf = y => y === 'cps' ? {lt: {s: 'all', m: 'all'}} : {};
  const extra = Object.assign({}, S.age ? {ag: {}} : {}, S.debt ? {dr: {}} : {}), tag = (S.age ? '.age' : '') + (S.debt ? '.debt' : '');
  const add = (name, c, y) => { Object.assign(c, yardOf(y), JSON.parse(JSON.stringify(extra))); out.push([name + tag, c]); };
  const raiseOn = c => { delete c.pw; return c; };
  const des = (d, c) => d === 'c22' ? H.c22Design(c) : c;
  const cellOf = (P, b) => { const c = pair(P)[1]; c.p = Object.assign({}, c.p); PKEY.forEach((k, i) => { c.p[k] = b[i]; }); return c; };
  const bits = m => [16, 8, 4, 2, 1].map(x => !!(m & x));
  if (S.cells === 'R') {  /* run manifest section 4, study R: 21 rows per yardstick */
    const K = H.CFG.KENYA_ABSORB_ROLLOUT, opt = (c, o) => { c.o = Object.assign({}, c.o || {}, o); return c; };
    S.yard.forEach(y => {
      const p = y + '.';
      add(p + 'pub.none', pair0(P0)[0], y); add(p + 'pub.rls', pair0(P0)[1], y); add(p + 'pub.c22', H.c22Design(pair0(P0)[1]), y);
      const au = c => Object.assign(c, {au: true});
      add(p + 'au.none', au(pair0(P0)[0]), y); add(p + 'au.rls', au(pair0(P0)[1]), y); add(p + 'au.c22', au(H.c22Design(pair0(P0)[1])), y);
      add(p + 'frz.none', pair(P0)[0], y); add(p + 'frz.rls', pair(P0)[1], y); add(p + 'frz.c22', H.c22Design(pair(P0)[1]), y);
      ['rls', 'c22'].forEach(d => {
        add(p + 'frz.' + d + '.mid', opt(des(d, pair(P0)[1]), {aK: K}), y);
        add(p + 'frz.' + d + '.h1', opt(des(d, pair(P0)[1]), {a: 1}), y);
        add(p + 'frz.' + d + '.fbs50', Object.assign(des(d, pair(P0)[1]), {fb: {dist: 'fbs50'}}), y); });
      const wo = c => Object.assign(c, {au: {gate: true, sg: true, fbs: true, wOut: true}});
      add(p + 'frz.none.wout', wo(pair(P0)[0]), y); add(p + 'frz.rls.wout', wo(pair(P0)[1]), y); add(p + 'frz.c22.wout', wo(H.c22Design(pair(P0)[1])), y);
      const s5 = c => Object.assign(c, {sc: SC});  /* after frozenRow: the frozen engine at the published share (Amendment 10) */
      add(p + 'frz.none.s593', s5(pair(P0)[0]), y); add(p + 'frz.rls.s593', s5(pair(P0)[1]), y); add(p + 'frz.c22.s593', s5(H.c22Design(pair(P0)[1])), y);
    });
    return out;
  }
  const n50 = P0.nAgents >= 50000, designs = DESIGNS(study).filter(d => !(n50 && d === 'rls'));
  designs.forEach(d => {
    const D = d + '.';
    if (S.cl) {  /* the community layer (addendum, Rows and Studies); CPS yardstick, raise off unless a row says so */
      const lay = (c, o) => { c.cl = Object.assign({}, o || {}); return c; };
      if (S.cells === 'G' || S.cells === 'G10') {
        for (let m = 31; m >= 1; m--) { const b = bits(m); if (!b[1]) continue; add(D + 'cps.' + (m === 31 ? 'main' : cellName(b)) + '.lay', lay(des(d, cellOf(P0, b))), 'cps'); }
        if (S.cells === 'G') { add(D + 'rel.main.lay', lay(des(d, pair(P0)[1])), 'rel'); add(D + 'cps.main.raise.lay', raiseOn(lay(des(d, pair(P0)[1]))), 'cps'); }
      }
      if (S.cells === 'H') {
        [['f67', {f: 2/3}], ['f100', {f: 1}], ['k50', {k: 50}], ['k250', {k: 250}], ['pop', {bass: 'pop'}]].forEach(([n, o]) => add(D + 'cps.main.' + n, lay(des(d, pair(P0)[1]), o), 'cps'));
        [[true, true], [true, false], [false, true], [false, false]].forEach(([cc, hh]) => { const b = [cc, true, hh, true, false];
          add(D + 'cps.' + cellName(b) + '.zc', lay(des(d, cellOf(P0, b)), {zc: true}), 'cps'); });
      }
      if (S.cells === 'I') [10, 30, 50].forEach(q => { const Pq = Object.assign({}, P0, {ptfShare: q/100});
        add(D + 'cps.main.s' + q + '.off', des(d, pair(Pq)[1]), 'cps'); add(D + 'cps.main.s' + q + '.lay', lay(des(d, pair(Pq)[1])), 'cps'); });
      if (S.cells === 'J') add(D + 'cps.main.lay', lay(des(d, pair(P0)[1])), 'cps');
      return;
    }
    S.yard.forEach(y => {
      const p = D + y + '.';
      add(p + 'none', pair(P0)[0], y);
      if (S.cells === 'pair') { add(p + 'main', des(d, pair(P0)[1]), y); if (S.raise) add(p + 'main.raise', raiseOn(des(d, pair(P0)[1])), y); }
      if (S.cells === 'all') for (let m = 31; m >= 1; m--) {
        const b = bits(m), nm = m === 31 ? 'main' : cellName(b); add(p + nm, des(d, cellOf(P0, b)), y);
        if (S.raise && b[0]) add(p + nm + '.raise', raiseOn(des(d, cellOf(P0, b))), y);
      }
      if (S.cells === 'part') PGRID.forEach(q => { const Pq = Object.assign({}, P0, {partRate: q/100});
        add(p + 'main.p' + q, des(d, pair(Pq)[1]), y); if (S.raise) add(p + 'main.raise.p' + q, raiseOn(des(d, pair(Pq)[1])), y); });
    });
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

function runBlock(H, S, env, adults, years, lo, hi, study) {
  const P = Object.assign({}, H[ENVN[env]], {years, nAgents: adults}), rows = blockRows(H, S, P, study), SC = H.SPEND_SOURCED;
  const so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: SC}, H.REL_V52_STUDY, S.sec ? {sec: true} : {}), cfgs = rows.map(r => r[1]);
  const AJ = S.age ? ageJoinHook(H) : null; if (AJ) H.setRepHook(AJ.hook);
  let R; try { R = H.tbStudy(cfgs, hi, P, so, lo); } finally { if (AJ) H.setRepHook(null); }
  const out = {}, pre = env + '.n' + adults + '.y' + years + '.', keys = keysFor(H, S, years), opt = OPTIONAL(H), nul = Array(hi - lo + 1).fill(null);
  rows.forEach((r, i) => { const o = {}; keys.forEach(k => {
    if (nullKey(k, r[0], years, S, H)) { o[k] = nul.slice(); return; }
    if (!R[i]._s[k]) { if (opt.has(k)) { o[k] = nul.slice(); return; } throw new Error('measure ' + k + ' not produced'); }
    o[k] = Array.from(R[i]._s[k]); }); out[pre + r[0]] = o; });
  if (AJ) {  /* runs finish in seed order, then row order (tbStudy); each main row is paired with the none row of its design and yardstick */
    const nc = cfgs.length; if (AJ.done.length !== (hi - lo + 1)*nc) throw new Error('age-at-joining hook saw ' + AJ.done.length + ' runs, expected ' + (hi - lo + 1)*nc);
    rows.forEach((r, i) => { if (/\.none/.test(r[0])) return; const dy = r[0].split('.').slice(0, 2).join('.'), ib = rows.findIndex(q => q[0] === dy + '.none' + (r[0].slice(r[0].indexOf('.main')).replace(/^\.main(\.raise)?/, '')));
      if (ib < 0) throw new Error('no none row for ' + r[0]);
      const o = out[pre + r[0]]; AJ_KEYS.forEach(k => { o[k] = []; });
      for (let s = 0; s <= hi - lo; s++) { const z = ageJoinStats(AJ.done[s*nc + i], AJ.done[s*nc + ib]); AJ_KEYS.forEach(k => { o[k].push(z[k]); }); } });
  }
  return out;
}

function checks() {
  /* 1. Row counts against the run manifest (section 4), per environment, population and horizon. 2. Study R's published-engine none and release rows
   * (released-wages yardstick) equal release-pair.js's byte for byte on every kept measure, 500 adults, 20 years, seeds 1-2, every environment.
   * 3. On the frozen engine, rows that must be equal: study B's none row and its cells without CCO on the two designs (neither has a BU; Adverse);
   * study R's wout rows and its frozen rows in Reference (no outside inflation). Seeds 1-2, 60 adults, 20 years. */
  const H = require(path.join(process.cwd(), 'harness.js')), bad = [];
  Object.keys(STUDY).forEach(s => { const S = STUDY[s]; S.sizes.forEach(n => {
    const c = blockRows(H, S, Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: n}), s).length, want = MANIFEST_ROWS[n >= 50000 ? s + '50' : s];
    console.log('study ' + s + ' at ' + n + ' adults: ' + c + ' rows per environment and horizon (run manifest: ' + want + ')'); if (c !== want) bad.push(s + ' n' + n); }); });
  const cp = require('child_process'), os = require('os'), tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'prog-'));
  Object.keys(ENVN).forEach(env => {
    cp.execFileSync(process.execPath, [path.join(__dirname, 'release-pair.js'), '--env=' + env, '--seeds=1-2', '--adults=500', '--years=20', '--out=' + path.join(tmp, env + '.json')], {stdio: 'ignore'});
    const ref = JSON.parse(fs.readFileSync(path.join(tmp, env + '.json'), 'utf8')).rows;
    const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G); let mine;
    try { mine = runBlock(H, Object.assign({}, STUDY.R, {yard: ['rel']}), env, 500, 20, 1, 2, 'R'); } finally { H.resetNR6(svN); H.tbSetG(svG); }
    [['none', 'pub.none'], ['main', 'pub.rls']].forEach(([rp, r]) => { const a = mine[env + '.n500.y20.rel.' + r], b = ref[rp], d = KEYS.filter(k => a[k][0] === null ? b[k].some(x => x !== 0) : JSON.stringify(a[k]) !== JSON.stringify(b[k]));
      console.log(env + ' R ' + r + ' row against release-pair.js ' + rp + ': ' + (d.length ? 'DIFFERS on ' + d.join(' ') : 'identical on every kept measure (keys written as null are 0 there)'));
      if (d.length) bad.push(env + ' ' + r); }); });
  fs.rmSync(tmp, {recursive: true, force: true});
  const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  try {
    const same = (lbl, a, b) => { const d = KEYS.filter(k => JSON.stringify(a[k]) !== JSON.stringify(b[k])); console.log(lbl + ': ' + (d.length ? 'DIFFER on ' + d.join(' ') : 'equal')); if (d.length) bad.push(lbl); };
    const B = runBlock(H, Object.assign({}, STUDY.B, {yard: ['cps'], raise: false}), 'adv', 60, 20, 1, 2, 'B'), pb = 'adv.n60.y20.';
    ['cFHZI', 'cfHzi', 'cFhZi'].forEach(c => same('B ' + c + ' on the two designs (Adverse)', B[pb + 'c22.cps.' + c], B[pb + 'rls.cps.' + c]));
    same('B none on the two designs (Adverse)', B[pb + 'c22.cps.none'], B[pb + 'rls.cps.none']);
    const R = runBlock(H, Object.assign({}, STUDY.R, {yard: ['cps']}), 'ref', 60, 20, 1, 2, 'R'), pr = 'ref.n60.y20.cps.frz.';
    ['none', 'rls', 'c22'].forEach(d => same('R ' + d + ' wout against frozen (Reference)', R[pr + d + '.wout'], R[pr + d]));
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  if (bad.length) { console.error('CHECKS FAILED: ' + bad.join(', ')); process.exit(1); }
  console.log('checks passed');
}

if (process.argv.includes('--check')) { checks(); return; }
const study = arg('study', ''), envA = arg('env', ''), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1), S = STUDY[study];
const envs = envA === 'all' ? Object.keys(ENVN) : [envA];
if (!S || !envs.every(e => ENVN[e]) || !m || !out || !Number.isInteger(procs) || procs < 1) { console.error('usage: program.js --study=R|A|B|B10|C|D|D10|F|G|G10|H|I|J --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1] [--sizes=..] [--years=..]'); process.exit(1); }
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
    sizes, years, keys: keysFor(H, S, Math.max(...years)), frozen: H.FROZEN, c22bu: H.c22NeedsBU(), sn: Object.assign({}, H.SNET_DEFAULTS, {abawd: true, slope: true}), manifest: H.runManifest(), command}, rows: {}}, blocks = {};
  try {
    envs.forEach(env => sizes.forEach(n => years.forEach(y => { const t1 = Date.now(); Object.assign(o.rows, runBlock(H, S, env, n, y, lo, hi, study));
      blocks[env + '.n' + n + '.y' + y] = +((Date.now() - t1)/1000).toFixed(2); console.error(env + ' ' + n + ' adults ' + y + ' years: ' + blocks[env + '.n' + n + '.y' + y] + ' s'); })));
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(o));
  const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({study, env: envA, seeds: n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss, blocks, node: process.version}));
  console.error('study ' + study + ' ' + envA + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s, peak memory ' + rss + ' MB');
}
