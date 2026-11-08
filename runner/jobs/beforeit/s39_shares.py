#!/usr/bin/env python3
"""S39: the Basic Unit sizes BeforeIT is given (runner/jobs/beforeit/shares.json), from the engine's own year paths.
python3 s39_shares.py PATH_DIR STUDY_A_DIR OUT.json   (PATH_DIR: the s39-path folder with ref-y20.json, adv-y20.json, st-y20.json;
STUDY_A_DIR: study A's folder, prog-a-ce8d030: every row's last-year price level must equal study A's plv_19, seed by seed, or nothing is written)
For each year t, the share is the mean over seeds 1-500 of U_t / Y_t in the engine (study A's row: 500 adults, 20 years, CPS yardstick, raise off):
U_t is the money the engine counts as not matched by output (its general price rule raises P_G by U_t / Y_t that year), Y_t the year's aggregate
cash income (wages, conversion pay and Social Security). 'gross' scales the C2.2 Reference path by the gross payout over its unmatched part
(srcPay / (srcPay - srcM), means over seeds): the payout as if none of it were matched by output."""
import json, sys, os, glob, numpy as np
d, adir, out = sys.argv[1], sys.argv[2], sys.argv[3]
A = {}
for f in sorted(glob.glob(os.path.join(adir, 'shard-*.json'))):
    if f.endswith('.timing.json'): continue
    for r, v in json.load(open(f))['rows'].items(): A.setdefault(r, []).extend(v['plv_19'])
S, info = {}, {}
for env in ('ref', 'adv', 'st'):
    R = json.load(open(os.path.join(d, env + '-y20.json')))
    for des in ('c22', 'rls'):
        r = R['rows']['%s.n500.y20.%s.cps.main' % (env, des)]
        U, Y = np.array(r['U'], float), np.array(r['Y'], float)
        for row in ('none', 'main', 'main.raise'):
            name = '%s.n500.y20.%s.cps.%s' % (env, des, row)
            got, want = [p[-1] for p in R['rows'][name]['full']], A[name]
            if len(got) != len(want) or max(abs(a - b) / max(1, abs(b)) for a, b in zip(got, want)) > 1e-9:
                sys.exit('%s: the path does not reproduce study A' % name)
        s = (U / Y).mean(0)
        S['%s.%s' % (des, env)] = [round(float(x), 6) for x in s]
        pay, m = float(np.mean(r['srcPay'])), float(np.mean(r['srcM']))
        info['%s.%s' % (des, env)] = {'seeds': int(U.shape[0]), 'meanShare': float(s.mean()), 'srcPay': pay, 'srcM': m, 'matchedShareOfPayout': m / pay,
                                      'pG_y19_mean': float(np.mean(np.array(r['PG'])[:, -1])), 'full_y19_mean': float(np.mean(np.array(r['full'])[:, -1]))}
        if des == 'c22' and env == 'ref':
            g = pay / (pay - m)
            S['c22.ref.gross'] = [round(float(x) * g, 6) for x in s]
            info['c22.ref.gross'] = {'factor': g}
json.dump({'what': __doc__.strip().splitlines()[0], 'shares': S, 'info': info}, open(out, 'w'), indent=1)
for k, v in S.items(): print(k, 'mean %.3f' % np.mean(v), 'y1 %.3f y5 %.3f y20 %.3f' % (v[0], v[4], v[19]))
