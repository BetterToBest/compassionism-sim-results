#!/usr/bin/env node
/* S54 (Nov 5, 2026): the policy-levers study's job script (research-update prereg/2026-11-levers-addendum.md, study N). It builds exactly the addendum's rows for
 * stage 1 (each lever on its own) or stage 2 (all levers together: a Morris screening and a Latin hypercube) and runs them on a range of seeds, in one or all three
 * environments, with the study option sec on (reporting only). Every row starts from the runner's reference job, as the backing, shock and security studies' do:
 * relMainCfgs(tbPresets(P)) with sc SPEND_SOURCED and sn {abawd, slope}, applyNR6(), tbSetG(TB_PROFILE_G), study options {fin: 'tax', aT: 0, a: 0, X: 0, sc}
 * plus REL_V52_STUDY and {sec: true}. Each programme row then carries o.wIdx and the engine's row option lv (compassionism-simulation dev/reports/s54-levers-reading.md)
 * with jn 'conv' (joining that sees what joining pays: the test reading) and tref = the design's own base tax, and changes only what its name says.
 *   DESIGN  rel (the release row as released) or c22 (the C2.2 design, CPS yardstick; its none row is the plain none row with that yardstick)
 *   wWW     wage indexation to the programme's price level, WW% (100 or 90)
 * Stage 1 rows (ENV.DESIGN.wWW.ROW, and ROW.sv: the same row and its no-programme run with savings that keep up with prices, row option sv):
 *   none                  the no-programme run
 *   asis                  the design with today's joining rule (lv without jn); base: the design with the test reading
 *   tNN, asis.tNN         base conversion tax NN% (p.tax), test reading and today's rule
 *   prPcC                 progression P points per rate point above 3x, cap C% (lv.pr, lv.pc)
 *   btNN                  a separate base rate on business conversions (lv.bt)
 *   kpNN                  the Source keeps NN% of the projects' sales (lv.keep)
 *   exNN                  NN% of expired BU recycled to projects, the rest retired (row option pj.share)
 *   fprog, fland, fflat   outside finance: a progressive income tax, a land-value tax, a flat contribution on wages (o.fin 'tax', o.taxBase)
 *   brR                   business conversion rate (lv.br; br15 = 1.5x)
 *   buNN                  NN% of the design's BU (p.bu)
 *   mmM                   top multiplier (p.maxMult)
 *   ocNN                  octave capacity enforced at NN% (lv.oc)
 *   noN                   number of octaves (p.maxOct)
 *   phi0                  the Phi tier off (p.phi false)
 *   phN                   conversions phased in over N years (lv.ph)
 *   capNN                 the Source's net new money capped at NN% of earned income a year, conversions rationed (lv.cap; 2, 4, 8)
 *   ixs, ixy, ixn         BU indexation: the surge protocol (5%), every year to the price level, every year to the price of basic needs
 *   sva, svc              the inflation-protected account paid for by the Source: all savings, or the first $10,000 (row option sv with lv.sv, lv.svc); no .sv twin
 *   rcap, hc, hcrc        the rent cap for BU tenants (lv.rc); the rent risk (row option hc, $1.41 a BU dollar for every renter outside PTH); both
 * Stage 2 rows (test reading, ordinary savings): ENV.DESIGN.w100.mT.S (Morris trajectory T, step S; w100 only), ENV.DESIGN.wWW.hI (Latin hypercube point I),
 *   ENV.DESIGN.wWW.none. The design (factors, trajectories, hypercube) is fixed by the seed 54 and written to _meta.design.
 * Stage 3 rows (added Nov 5, 2026, addendum amendment 1; seeds 51-100 in the pilot): ENV.DESIGN.wWW.none and ENV.DESIGN.wWW.NAME for every setting in the
 *   list (levers-stage3.json), NAME a stage-1 lever or a stage-2 point; the chosen setting (if any) also NAME.sv (with none.sv) and NAME.asis. All keys of stage 1;
 *   the list is written to _meta.list.
 * Each row holds one value per seed for every measure in KEYS. Seeds are paired and independent, so any split of 1..N joins to the same numbers. --procs=K runs the
 * environments, and pieces of the seed range within each, as separate processes and joins them (the same bytes as one process).
 *
 * Run in an engine checkout (a clean worktree of the pinned commit):
 *   node RESULTS/runner/jobs/levers.js --stage=1|2|3 --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1] [--list=FILE (stage 3)]
 *   node RESULTS/runner/jobs/levers.js --check      (the row counts against the addendum; no output file)
 * FILE holds only deterministic content; seconds and memory go to stderr and FILE without .json plus .timing.json. */
const fs = require('fs'), path = require('path');
const ENVN = {ref: 'FULL_INTEGRATION', adv: 'ADVERSE_REFERENCE', st: 'STRESS_TEST'};
const arg = (k, d) => { const a = process.argv.find(x => x.startsWith('--' + k + '=')); return a ? a.slice(k.length + 3) : d; };
/* S47 (run manifest sections 4 and 6 item 7; the S48 batch's version):
 *   --frozen  every row, the no-programme rows included, on the frozen engine (harness.js frozenRow: au, fx, the share 0.877); the money-income falls by cause
 *             (security addendum Amendment 1 item 3a: secF25, secF25w, secF25c, secF25o for all adults, participants and those not taking part) on every row
 *   --sx=main every row on S52's main outside supply-shock path (study N3x; the supply-shock addendum's main path and PTF reading, harness SX_DEFAULTS)
 *   --gzip    recorded in the command; the run-study workflow compresses the shard files (gzip -n) after checking them. The kept keys are already the
 *             addendum's outcomes and what dev/tools/s54_levers.py reads (KEYS1, KEYS2). */
const FRZ = process.argv.includes('--frozen'), SXM = arg('sx', '') === 'main', GZ = process.argv.includes('--gzip');
const SEC_F = ['secF25', 'secF25w', 'secF25c', 'secF25o'];

const DES = ['rel', 'c22'], W1 = [100, 90];
const TAX = [0, 4, 8, 12, 16, 20, 25, 30, 40];
const KEYS1 = ['fgt0PY', 'pov', 'bNAPy', 'bOAPy', 'gNonF0', 'gNonW', 'gPartF0', 'gPartW', 'endoAnn', 'pLev20', 'cost', 'giniD', 'medWealthReal', 'emp', 'hrs', 'fgt2PY',
  'lvJ1', 'lvJ7', 'lvJ19', 'lvJm', 'lvU', 'lvP', 'lvBk', 'lvKp', 'lvSv', 'lvQ', 'lvCap', 'secU25A', 'secU25P', 'secU25X', 'secM3A', 'secM3P', 'secM3X'];
const KEYS2 = ['fgt0PY', 'pov', 'bNAPy', 'gNonF0', 'gNonW', 'endoAnn', 'cost', 'giniD', 'lvJm', 'lvU', 'lvQ', 'lvCap', 'secU25X', 'secM3X'];
/* per environment: stage 1, per design and wage indexation: none + none.sv, 65 programme rows (asis, base, 9 + 9 tax, 5 progression, 4 business tax, 3 keep, 2 recycling,
 * 3 finance, 3 business rate, 2 BU, 3 multiplier, 3 octave capacity, 3 octaves, Phi, 2 phase-in, 3 caps, 3 indexation, 2 accounts, 3 rent) and 63 .sv twins = 130; x 4 = 520.
 * Stage 2: per design, Morris 10 trajectories x 18 points at w100 (180) and the hypercube's 200 points at w100 and w90 (400), plus 2 none rows = 582; x 2 = 1164. */
const PREREG = {1: 520, 2: 1164};

const lvl = (u, n) => Math.min(n - 1, Math.floor(u*n));
/* Stage 2's 17 factors: u in [0, 1] -> the lever's setting (stage 1's ranges; levels in order). */
const FACTORS = [
  ['tax', (c, u) => { c.p.tax = 0.40*u; }],
  ['pr', (c, u) => { c.o.lv.pr = 0.08*u; }],
  ['pc', (c, u) => { c.o.lv.pc = 0.50 + 0.25*u; }],
  ['bt', (c, u) => { c.o.lv.bt = 0.75*u; }],
  ['keep', (c, u) => { c.o.lv.keep = 0.50*u; }],
  ['ex', (c, u) => { c.pj = Object.assign({}, c.pj || {}, {share: u}); }],
  ['br', (c, u) => { c.o.lv.br = 1 + 2*u; }],
  ['bu', (c, u) => { c.p.bu = c.p.bu*(0.6 + 0.4*u); }],
  ['mm', (c, u) => { c.p.maxMult = 3 + 6*u; }],
  ['oc', (c, u) => { const v = [null, 1, 0.5, 0.25][lvl(u, 4)]; if (v !== null) c.o.lv.oc = v; }],
  ['no', (c, u) => { c.p.maxOct = 2 + lvl(u, 5); }],
  ['phi', (c, u) => { c.p.phi = lvl(u, 2) === 0; }],
  ['ph', (c, u) => { c.o.lv.ph = Math.round(1 + 9*u); }],
  ['cap', (c, u) => { const v = [null, 0.08, 0.04, 0.02][lvl(u, 4)]; if (v !== null) c.o.lv.cap = v; }],
  ['ix', (c, u, d) => { ix(c, d, ['s', 'y', 'n'][lvl(u, 3)]); }],
  ['sv', (c, u) => { const v = lvl(u, 3); if (v > 0){ c.sv = true; c.o.lv.sv = true; if (v === 1) c.o.lv.svc = 10000; } }],
  ['rc', (c, u) => { if (lvl(u, 2) === 1) c.o.lv.rc = true; }]];
function ix(c, d, k){  /* BU indexation: s the surge protocol, y every year to the price level, n every year to the price of basic needs */
  if (d === 'rel'){ if (k === 'y') c.p.colaThresh = -1; else if (k === 'n') c.c22 = {idx: 'needs'}; }
  else { if (k === 's') c.c22 = {auto: true}; else if (k === 'y'){ c.c22 = {auto: true}; c.p.colaThresh = -1; } }
}
function mulberry(s){ return () => { s = (s + 0x6D2B79F5) >>> 0; let t = Math.imul(s ^ (s >>> 15), 1 | s); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0)/4294967296; }; }
function design(){  /* Morris: 10 trajectories on a 4-level grid (delta 2/3), bases in {0, 1/3}, random factor order; hypercube: 200 points, one per stratum per factor */
  const R = mulberry(54), k = FACTORS.length, D = 2/3, morris = [], lhs = [];
  for (let t = 0; t < 10; t++){ const x = FACTORS.map(() => R() < 0.5 ? 0 : 1/3), ord = FACTORS.map((f, i) => i);
    for (let i = k - 1; i > 0; i--){ const j = Math.floor(R()*(i + 1)); [ord[i], ord[j]] = [ord[j], ord[i]]; }
    const pts = [x.slice()]; ord.forEach(i => { x[i] += D; pts.push(x.slice()); }); morris.push({order: ord.map(i => FACTORS[i][0]), points: pts}); }
  const perm = FACTORS.map(() => { const p = Array.from({length: 200}, (v, i) => i); for (let i = 199; i > 0; i--){ const j = Math.floor(R()*(i + 1)); [p[i], p[j]] = [p[j], p[i]]; } return p; });
  for (let i = 0; i < 200; i++) lhs.push(FACTORS.map((f, j) => (perm[j][i] + R())/200));
  return {factors: FACTORS.map(f => f[0]), delta: D, morris, lhs};
}

/* Stage 1's levers for design d, in the job's row order: [name, f(c)]. */
function levers1(H, d){
  const HCAP = {c: H.CFG.HOUSING_CAPTURE_HIGH, all: true};
  const L = [['asis', c => { delete c.o.lv.jn; }], ['base', c => {}]];
  TAX.forEach(t => L.push(['t' + t, c => { c.p.tax = t/100; }]));
  TAX.forEach(t => L.push(['asis.t' + t, c => { delete c.o.lv.jn; c.p.tax = t/100; }]));
  [[0, 75], [8, 75], [0, 50], [4, 50], [8, 50]].forEach(([p, q]) => L.push(['pr' + p + 'c' + q, c => { c.o.lv.pr = p/100; c.o.lv.pc = q/100; }]));
  [0, 25, 50, 75].forEach(b => L.push(['bt' + b, c => { c.o.lv.bt = b/100; }]));
  [10, 25, 50].forEach(k => L.push(['kp' + k, c => { c.o.lv.keep = k/100; }]));
  [50, 0].forEach(x => L.push(['ex' + x, c => { c.pj = Object.assign({}, c.pj || {}, {share: x/100}); }]));
  [['fprog', 'prog'], ['fland', 'land'], ['fflat', undefined]].forEach(([n, b]) => L.push([n, c => { c.o.fin = 'tax'; c.o.a = 0; if (b) c.o.taxBase = b; }]));
  [[1, '1'], [1.5, '15'], [2, '2']].forEach(([r, n]) => L.push(['br' + n, c => { c.o.lv.br = r; }]));
  [60, 80].forEach(b => L.push(['bu' + b, c => { c.p.bu = c.p.bu*b/100; }]));
  [3, 6, 9].forEach(m => L.push(['mm' + m, c => { c.p.maxMult = m; }]));
  [25, 50, 100].forEach(o => L.push(['oc' + o, c => { c.o.lv.oc = o/100; }]));
  [2, 4, 6].forEach(n => L.push(['no' + n, c => { c.p.maxOct = n; }]));
  L.push(['phi0', c => { c.p.phi = false; }]);
  [5, 10].forEach(n => L.push(['ph' + n, c => { c.o.lv.ph = n; }]));
  [2, 4, 8].forEach(k => L.push(['cap' + k, c => { c.o.lv.cap = k/100; }]));
  return L.concat(['s', 'y', 'n'].map(k => ['ix' + k, c => ix(c, d, k)]),
    [['sva', c => { c.sv = true; c.o.lv.sv = true; }], ['svc', c => { c.sv = true; c.o.lv.sv = true; c.o.lv.svc = 10000; }],
     ['rcap', c => { c.o.lv.rc = true; }], ['hc', c => { c.hc = HCAP; }], ['hcrc', c => { c.hc = HCAP; c.o.lv.rc = true; }]]);
}
/* Stage 3 (addendum amendment of Nov 5, 2026): the settings list written by compassionism-simulation dev/tools/s54_levers.py --select (default
 * runner/jobs/levers-stage3.json beside this script). Per design and wage: the no-programme row; every setting listed (a stage-1 lever name, or a stage-2
 * point hI or mT.S, rebuilt from the same seed-54 design); the chosen setting, if any, also with its .sv twin (and none.sv) and under today's joining rule (.asis). */
function list3(){ return JSON.parse(fs.readFileSync(path.resolve(__dirname, arg('list', 'levers-stage3.json')), 'utf8')); }  /* a bare name is read beside this script (the workflow allows no '/' in job_args); an absolute path is read as given */

function rows(H, P, stage){
  const SC = H.SPEND_SOURCED, SN = {abawd: true, slope: true}, out = [];
  const pair = d => H.relMainCfgs(H.tbPresets(P)).map((c, i) => { Object.assign(c, {sc: SC, sn: SN});
    if (d === 'c22'){ c.lt = {s: 'all', m: 'all'}; if (i === 1){ c.c22 = {auto: true, idx: 'needs'}; c.p = Object.assign({}, c.p, {bu: H.c22NeedsBU()}); } }
    return c; });
  const none = (d, w, sv) => { const c = pair(d)[0]; c.o = Object.assign({}, c.o || {}, {wIdx: w/100}); if (sv) c.sv = true; return c; };
  const prog = (d, w, f, sv) => { const c = pair(d)[1]; c.p = Object.assign({}, c.p); c.o = Object.assign({}, c.o || {}, {wIdx: w/100});
    c.o.lv = {jn: 'conv', tref: c.p.tax}; f(c); if (sv) c.sv = true; return c; };
  const X = design(), pt = (d, u) => c => FACTORS.forEach((f, j) => f[1](c, u[j], d));
  if (stage === 1){
    const NOSV = ['sva', 'svc'];
    DES.forEach(d => {
      const LD = levers1(H, d);
      W1.forEach(w => {
        out.push([d + '.w' + w + '.none', none(d, w, false)], [d + '.w' + w + '.none.sv', none(d, w, true)]);
        LD.forEach(([n, f]) => { out.push([d + '.w' + w + '.' + n, prog(d, w, f, false)]); if (NOSV.indexOf(n) < 0) out.push([d + '.w' + w + '.' + n + '.sv', prog(d, w, f, true)]); });
      });
    });
  } else if (stage === 2){
    const apply = (d, w, u) => prog(d, w, pt(d, u), false);
    DES.forEach(d => {
      W1.forEach(w => out.push([d + '.w' + w + '.none', none(d, w, false)]));
      X.morris.forEach((tr, t) => tr.points.forEach((u, s) => out.push([d + '.w100.m' + t + '.' + s, apply(d, 100, u)])));
      W1.forEach(w => X.lhs.forEach((u, i) => out.push([d + '.w' + w + '.h' + i, apply(d, w, u)])));
    });
  } else {
    list3().sets.forEach(s => {
      const d = s.design, w = s.wage, pre = d + '.w' + w + '.', LD = new Map(levers1(H, d));
      const fOf = n => { if (LD.has(n)) return LD.get(n); let m = /^h(\d+)$/.exec(n); if (m && X.lhs[+m[1]]) return pt(d, X.lhs[+m[1]]);
        m = /^m(\d+)\.(\d+)$/.exec(n); if (m && X.morris[+m[1]] && X.morris[+m[1]].points[+m[2]]) return pt(d, X.morris[+m[1]].points[+m[2]]);
        throw new Error('stage 3: unknown setting ' + n); };
      out.push([pre + 'none', none(d, w, false)]);
      if (s.chosen) out.push([pre + 'none.sv', none(d, w, true)]);
      (s.chosen ? [s.chosen] : []).concat(s.pareto.filter(n => n !== s.chosen)).forEach(n => { const f = fOf(n);
        out.push([pre + n, prog(d, w, f, false)]);
        if (n === s.chosen){ if (!prog(d, w, f, false).o.lv.sv) out.push([pre + n + '.sv', prog(d, w, f, true)]);
          out.push([pre + n + '.asis', prog(d, w, c => { f(c); delete c.o.lv.jn; }, false)]); } });
    });
  }
  return out;
}

if (process.argv.includes('--check')) {
  const H = require(path.join(process.cwd(), 'harness.js')), P = Object.assign({}, H.FULL_INTEGRATION, {years: 20, nAgents: 500});
  let ok = Array.isArray(H.LV_KEYS); const msg = [];
  [1, 2].forEach(s => { const R = rows(H, P, s), names = new Set(R.map(r => r[0])), good = R.length === PREREG[s] && names.size === R.length; ok = ok && good;
    msg.push('stage ' + s + ': ' + R.length + ' rows per environment (addendum: ' + PREREG[s] + '), distinct names: ' + names.size); });
  { const L3 = list3(), R = rows(H, P, 3), names = new Set(R.map(r => r[0]));
    const want = [].concat(...L3.sets.map(s => { const pre = s.design + '.w' + s.wage + '.'; return [pre + 'none'].concat(s.chosen ? [pre + s.chosen, pre + 'none.sv', pre + s.chosen + '.asis'] : [], s.pareto.map(n => pre + n)); }));
    const miss = want.filter(n => !names.has(n)), good = names.size === R.length && !miss.length; ok = ok && good;
    msg.push('stage 3: ' + R.length + ' rows per environment (list: ' + L3.sets.length + ' designs and wages), distinct names: ' + names.size + (miss.length ? ', missing: ' + miss.slice(0, 3).join(' ') : '')); }
  console.log((ok ? 'PASS' : 'FAIL') + '  ' + msg.join('; ') + (Array.isArray(H.LV_KEYS) ? '' : '; engine has no policy levers'));
  process.exit(ok ? 0 : 1);
}

const stage = +arg('stage', 0), env = arg('env', 'ref'), m = /^(\d+)-(\d+)$/.exec(arg('seeds', '')), out = arg('out', ''), procs = +arg('procs', 1);
const ENVS = env === 'all' ? ['ref', 'adv', 'st'] : [env];
if (!(stage === 1 || stage === 2 || stage === 3) || !ENVS.every(e => ENVN[e]) || !m || !out || !Number.isInteger(procs) || procs < 1 || (arg('sx', '') && !SXM)) {
  console.error('usage: levers.js --stage=1|2|3 --env=ref|adv|st|all --seeds=A-B --out=FILE [--procs=1] [--list=FILE] [--frozen] [--sx=main] [--gzip]'); process.exit(1); }
const lo = +m[1], hi = +m[2], t0 = Date.now(), KEYS = (stage === 2 ? KEYS2 : KEYS1).concat(FRZ ? [].concat(...SEC_F.map(k => (stage === 2 ? ['X'] : ['A', 'P', 'X']).map(g => k + g))) : []);
const FLAGS = [].concat(FRZ ? ['--frozen'] : [], SXM ? ['--sx=main'] : [], GZ ? ['--gzip'] : []), CMD = (e, a, b) => 'node runner/jobs/levers.js --stage=' + stage + ' --env=' + e + ' --seeds=' + a + '-' + b + (FLAGS.length ? ' ' + FLAGS.join(' ') : '');
if (procs > 1 && (ENVS.length > 1 || hi > lo)) {
  /* pieces: each environment on its own, its seeds cut into floor(procs / environments) contiguous chunks (at least one) */
  const cp = require('child_process'), parts = [], per = Math.max(1, Math.floor(procs/ENVS.length));
  ENVS.forEach(e => { const n0 = hi - lo + 1, k = Math.min(per, n0); let s0 = lo;
    for (let i = 0; i < k; i++) { const c = Math.floor(n0/k) + (i < n0 % k ? 1 : 0); parts.push({env: e, from: s0, to: s0 + c - 1, file: out.replace(/\.json$/, '') + '.part' + parts.length + '.json'}); s0 += c; } });
  const kids = parts.map(q => new Promise((ok, no) => { const c = cp.spawn(process.execPath, [__filename, '--stage=' + stage, '--env=' + q.env, '--seeds=' + q.from + '-' + q.to, '--out=' + q.file].concat(arg('list') ? ['--list=' + arg('list')] : [], FLAGS), {stdio: 'inherit'});
    c.on('exit', code => code === 0 ? ok() : no(new Error('piece ' + q.env + ' ' + q.from + '-' + q.to + ' exited ' + code))); }));
  Promise.all(kids).then(() => {
    const D = parts.map(q => JSON.parse(fs.readFileSync(q.file, 'utf8'))), o = D[0];
    o._meta.env = env; o._meta.seeds = [lo, hi]; o._meta.command = CMD(env, lo, hi); const J = {};
    ENVS.forEach(e => { const P = parts.map((q, i) => [q, D[i]]).filter(x => x[0].env === e);
      Object.keys(P[0][1].rows).forEach(r => { J[r] = {}; Object.keys(P[0][1].rows[r]).forEach(key => { J[r][key] = [].concat(...P.map(x => x[1].rows[r][key])); }); }); });
    o.rows = J;
    fs.writeFileSync(out, JSON.stringify(o));
    const T = parts.map(q => JSON.parse(fs.readFileSync(q.file.replace(/\.json$/, '') + '.timing.json', 'utf8'))), secs = (Date.now() - t0)/1000, n = hi - lo + 1;
    fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({stage, env, seeds: n, procs: parts.length, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: Math.max(...T.map(t => t.peakRssMB)), node: process.version}));
    parts.forEach(q => { fs.unlinkSync(q.file); fs.unlinkSync(q.file.replace(/\.json$/, '') + '.timing.json'); });
    console.error('stage ' + stage + ' ' + env + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s in ' + parts.length + ' processes');
  }).catch(e => { console.error(e.message); process.exit(1); });
} else {
  const H = require(path.join(process.cwd(), 'harness.js'));
  const svN = H.applyNR6(), svG = H.tbSetG(H.TB_PROFILE_G);
  const o = {_meta: {what: 'S54 policy-levers study, stage ' + stage + ' (prereg/2026-11-levers-addendum.md, study N): per-seed values', stage, env, seeds: [lo, hi], adults: 500, years: 20, keys: KEYS,
    manifest: H.runManifest(), command: CMD(env, lo, hi), frozen: FRZ ? H.FROZEN : null, sx: SXM ? 'main' : null}, rows: {}};
  if (stage === 2) o._meta.design = design();
  if (stage === 3) o._meta.list = list3();
  try {
    ENVS.forEach(e => {
      const P = Object.assign({}, H[ENVN[e]], {years: 20, nAgents: 500}), so = Object.assign({fin: 'tax', aT: 0, a: 0, X: 0, sc: H.SPEND_SOURCED, sec: true}, H.REL_V52_STUDY);
      if (SXM) P.sx = {};  /* as shock.js's main path: the environment's and every row's p.sx */
      const R0 = rows(H, P, stage), R = H.tbStudy(R0.map(r => { let c = r[1]; if (SXM) c.p = Object.assign({}, c.p, {sx: {}}); if (FRZ) c = H.frozenRow(c); return c; }), hi, P, so, lo);
      R0.forEach((r, i) => { const v = {}; KEYS.forEach(k => { if (R[i]._s[k]) v[k] = Array.from(R[i]._s[k]); }); o.rows[e + '.' + r[0]] = v; });
    });
  } finally { H.resetNR6(svN); H.tbSetG(svG); }
  fs.mkdirSync(path.dirname(path.resolve(out)), {recursive: true});
  fs.writeFileSync(out, JSON.stringify(o));
  const secs = (Date.now() - t0)/1000, n = hi - lo + 1, rss = Math.round(process.resourceUsage().maxRSS/1024);
  fs.writeFileSync(out.replace(/\.json$/, '') + '.timing.json', JSON.stringify({stage, env, seeds: n, seconds: +secs.toFixed(2), secondsPerSeed: +(secs/n).toFixed(3), peakRssMB: rss, node: process.version}));
  console.error('stage ' + stage + ' ' + env + ' seeds ' + lo + '-' + hi + ': ' + secs.toFixed(1) + ' s (' + (secs/n).toFixed(2) + ' s a seed), peak memory ' + rss + ' MB');
}
