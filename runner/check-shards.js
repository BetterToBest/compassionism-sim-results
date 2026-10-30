#!/usr/bin/env node
/* Final check of a study folder written by the run-study workflow (S33).
 * Usage: node runner/check-shards.js DIR MATRIX_JSON ENGINE_COMMIT
 * For every planned shard: its data file, timing file and log exist; the data file records the planned seed range and the engine commit with a clean worktree; and,
 * where the file holds per-seed arrays under rows, each array has one value per seed. Exits 1 on the first problem list. */
const fs = require('fs'), path = require('path');
const [dir, matrix, engine] = process.argv.slice(2), plan = JSON.parse(matrix).include, bad = [];
plan.forEach(s => {
  const n = String(s.shard).padStart(4, '0'), f = path.join(dir, 'shard-' + n + '.json');
  ['.json', '.timing.json', '.log'].forEach(x => { if (!fs.existsSync(path.join(dir, 'shard-' + n + x))) bad.push('shard ' + s.shard + ': missing shard-' + n + x); });
  if (!fs.existsSync(f)) return;
  let d; try { d = JSON.parse(fs.readFileSync(f, 'utf8')); } catch (e) { bad.push('shard ' + s.shard + ': not valid JSON'); return; }
  const m = d._meta || {};
  if (!m.seeds || m.seeds[0] !== s.from || m.seeds[1] !== s.to) bad.push('shard ' + s.shard + ': records seeds ' + JSON.stringify(m.seeds) + ', planned ' + s.from + '-' + s.to);
  if (!m.manifest || m.manifest.commit !== engine) bad.push('shard ' + s.shard + ': engine commit ' + (m.manifest && m.manifest.commit) + ', expected ' + engine);
  if (!m.manifest || m.manifest.dirty !== false) bad.push('shard ' + s.shard + ': engine worktree not recorded as clean');
  const want = s.to - s.from + 1;
  Object.keys(d.rows || {}).forEach(r => Object.keys(d.rows[r]).forEach(k => { const v = d.rows[r][k]; if (Array.isArray(v) && v.length !== want) bad.push('shard ' + s.shard + ': ' + r + '.' + k + ' has ' + v.length + ' values, expected ' + want); }));
});
let next = plan[0].from; plan.forEach(s => { if (s.from !== next) bad.push('planned ranges leave a gap or overlap at seed ' + s.from); next = s.to + 1; });
if (bad.length) { console.error('::error::' + bad.slice(0, 20).join('\n')); process.exit(1); }
console.log('all ' + plan.length + ' shard(s) checked: seeds ' + plan[0].from + '-' + (next - 1) + ' covered once');
