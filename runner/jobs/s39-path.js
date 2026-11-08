#!/usr/bin/env node
/* S39 (Nov 8, 2026; research-update prereg/2026-11-s39-outside-crosscheck.md): the engine side of the outside cross-check.
 * Study A (prog-a-<engine>) kept the price level at years 10, 20 and 40 only. The cross-check needs, year by year and for the same rows and seeds,
 * the price level and the money the engine counts as unmatched by output (U, the input to its general price rule, pmGenStep: P_G grows by lamG x U/Y)
 * with the year's aggregate cash income Y. This script rebuilds study A's rows (program.js, cells 'pair', yardstick cps, raise off and on) and runs
 * them with the engine's own tbStudy under the runner's reference settings (applyNR6, tbSetG(TB_PROFILE_G)), as program.js does. It reads each run's year path (tbRunCore's return value: bIdx, PG, U, Y, tau, colaLevel, full) through a
 * wrapper around tbRunCore added to the built script in memory. Nothing in the engine changes: the wrapper only copies the path the engine already
 * returns, draws nothing, and the figures of every row are the study's (the script checks the last year's price level against tbStudy's own output, and s39_shares.py checks
 * plv_19 seed by seed against study A's published shards).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/s39-path.js --env=ref|adv|st|all --adults=500 --years=20 --seeds=A-B --out=FILE
 */
const fs = require('fs'), path = require('path'), vm = require('vm');
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'};
const cwd = process.cwd(), H0 = require(path.join(cwd, 'harness.js'));
const src = H0.builtSource() + '\nvar S39_REC = null, S39_IN = null; var S39_TRC = tbRunCore; tbRunCore = function(){ var r = S39_TRC.apply(this, arguments); if (S39_IN && r && r.path) S39_IN.push(r.path); return r; };\n' +
  'var S39_TR = tbRun; tbRun = function(){ var keep = S39_IN; S39_IN = []; try { var r = S39_TR.apply(this, arguments); if (S39_REC) S39_REC.push({p: arguments[0], path: S39_IN[S39_IN.length - 1]}); return r; } finally { S39_IN = keep; } };\n' +
  'module.exports.s39Rec = function(x){ var o = S39_REC; S39_REC = x; return o; };\n';
const mod = {exports: {}};
vm.runInThisContext('(function (require, module, exports, __dirname, __filename, builtSource, csEngineSource) {' + src + '\n})', {filename: path.join(cwd, 'harness.js')})
  (require, mod, mod.exports, cwd, path.join(cwd, 'harness.js'), H0.builtSource, H0.csEngineSource);
const H = mod.exports;
const envs = arg('env', 'ref') === 'all' ? ['ref', 'adv', 'st'] : [arg('env', 'ref')];
const adults = +arg('adults', '500'), years = +arg('years', '20'), [lo, hi] = arg('seeds', '1-2').split('-').map(Number), out = arg('out', null);
if (!out) throw new Error('--out=FILE');
const SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true};
function rowsFor(P) {
  const pair = () => H.relMainCfgs(H.tbPresets(P)).map(c => H.frozenRow(Object.assign(c, {sc: SC, sn: SN})));
  const cps = c => Object.assign(c, {lt: {s: 'all', m: 'all'}}), raise = c => { delete c.pw; return c; };
  const r = [];
  ['c22', 'rls'].forEach(d => { const des = c => d === 'c22' ? H.c22Design(c) : c;
    r.push([d + '.cps.none', cps(pair()[0])], [d + '.cps.main', cps(des(pair()[1]))], [d + '.cps.main.raise', cps(raise(des(pair()[1])))]); });
  return r;
}
const K = ['U', 'Y', 'PG', 'full', 'bIdx', 'colaLevel'];
/* the run's totals beside the path (per adult-year, year-0 dollars; tbStudy's own keys) */
const SUMK = ['cost', 'cBU', 'cConv', 'cCash', 'cCap', 'cPth', 'tax', 'need', 'treas', 'tauMean', 'endoAnn', 'pLev10', 'pLev20', 'srcIss', 'srcPay', 'srcTax', 'srcM', 'srcCover', 'emp', 'hrs', 'Er'];
const res = {_meta: {what: 'S39 engine side: year paths of study A rows (cps yardstick)', adults, years, seeds: [lo, hi], keys: K, totals: SUMK,
  manifest: typeof H.runManifest === 'function' ? H.runManifest() : null, command: 'node runner/jobs/s39-path.js ' + process.argv.slice(2).join(' ')}, rows: {}};
const t0 = Date.now();
const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);  /* the runner's reference settings, as program.js sets them */
try {
envs.forEach(env => {
  const P = Object.assign({}, H[ENVN[env]], {years, nAgents: adults}), rows = rowsFor(P);
  const so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: SC}, H.REL_V52_STUDY);
  const rec = []; H.s39Rec(rec);
  let R; try { R = H.tbStudy(rows.map(r => r[1]), hi, P, so, lo); } finally { H.s39Rec(null); }
  const nS = hi - lo + 1, nr = rows.length, cf = rows.map(r => r[1]);
  const byRow = cf.map(c => rec.filter(e => e.p === c.p).map(e => e.path));
  byRow.forEach((b, i) => { if (b.length !== nS) throw new Error(rows[i][0] + ': ' + b.length + ' paths for ' + nS + ' seeds'); });
  rows.forEach(([name], i) => {
    const o = {}; K.forEach(k => { o[k] = []; });
    for (let s = 0; s < nS; s++) { const p = byRow[i][s]; K.forEach(k => o[k].push(p.map(y => y[k]))); }
    // check against the study's own figures
    for (let s = 0; s < nS; s++) { const want = R[i]._s.pLev20[s], got = o.full[s][years - 1];
      if (Math.abs(got - want) > 1e-9*Math.max(1, Math.abs(want))) throw new Error(name + ' seed ' + (lo + s) + ': path ' + got + ' vs study ' + want); }
    SUMK.forEach(k => { o[k] = R[i]._s[k] ? Array.from(R[i]._s[k]) : null; });
    res.rows[env + '.n' + adults + '.y' + years + '.' + name] = o;
  });
});
} finally { H.resetNR6(svN); H.tbSetG(svG); }
fs.writeFileSync(out, JSON.stringify(res));
fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({seconds: (Date.now() - t0)/1000}));
console.error('done in ' + ((Date.now() - t0)/1000).toFixed(1) + ' s');
