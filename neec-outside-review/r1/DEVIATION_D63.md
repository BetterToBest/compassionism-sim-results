# Run r1, deviation D63: Jev reads over-long packs in windows

Reported deviation from `PREREG.md` section 1 (runner md5) and section 6 (Jev). Recorded 2026-10-20, after run
39372446024 and before any windowed call.

## What happened

Jev answered 189 of the 294 units with a pack, in both passes. The other 105 units (every unit of C2.1, C2.4,
C2.6, C3.6, C4.2 and C4.6, and CCO|C4.4 and INT|C4.4) were refused, all 210 calls, with HTTP 400
`{"detail": {"error_type": "max_tokens_exceeded"}}`.

## Cause

Jev judges at most about 32,000 of its own tokens of state plus the longest question per call. The runner's
guard (`JEV_MAX_CHARS` 200,000) counts characters, and the packs differ greatly in tokens per character: prose runs
about 0.25 tokens per character, the numeric tables and JSON in some packs up to about 0.77. So a pack can be
shorter in characters than one Jev accepted and still be longer in tokens, which is why pack length alone did not
explain the failures.

Measured on the kit with a public tokenizer (o200k), every refused request is larger than every accepted one: the
accepted requests come to at most 23,600 tokens on that count, the refused ones to at least 28,600, with no overlap.
Jev's own count runs 1.05 to 1.65 times the public one, and the largest request Jev accepted used 31,357 of its
tokens (SWF|C4.4), just under the 32,000 limit. No other cause is needed.

## The change

`outside_review_runner.py` (new md5 recorded in the commit) reads a unit Jev refuses as too long in windows:

- The pack is split, in order, into windows of at most 40,000 characters (`JEV_WINDOW_CHARS`). Files are kept
  whole where they fit; a longer file is cut at line ends and each part headed with the file and its part number.
  Nothing is dropped: the selftest checks the windows together are the whole pack.
- Each window is one Jev call with the same system, criterion and questions as the whole-pack call. A window Jev
  still refuses as too long is halved and asked again, down to 4,000 characters (`JEV_MIN_WINDOW`).
- The 189 units already answered are untouched. A unit whose whole-pack call was already refused goes straight to
  windows.

## How windows combine (fixed before any windowed call)

For each clause: if any window shows the clause (cleared or short), the clause takes that window's choice; where
windows show it differently, it takes the choice held with the highest probability, and the conflict is recorded.
If every window answers not_shown, the clause is not_shown.

Each results line keeps every window's answers, size, usage and request md5, so any other rule can be applied later
from the record.

## Reporting

- The 105 windowed units are reported apart from the 189 whole-pack units, and marked `"deviation": "D63 windowed"`.
- A window sees only part of the pack, so a fact spread across files may be missed; the windowed units lean toward
  not_shown more than whole-pack reading would. Clauses with a recorded conflict are listed.
- Jev still never sets a verdict (section 6); its use in adjudication is unchanged.

## Test before the full rerun

A dry run on one refused unit per criterion (CCO|C2.1, CCO|C2.4, CCO|C2.6, CCO|C3.6, CCO|C4.2, CCO|C4.4,
CCO|C4.6), through the workflow's dry-run path, with the repository's key. Its results go to `dryrun/`, never mixed
with the run's.

**Result (dry run 39384503965, 2026-10-20):** all seven units answered in both passes, 14 of 14, HTTP 200, no window
refused, `jev-1.13.0` served. 4 to 11 windows per unit; the largest window Jev accepted used 32,187 of its tokens.
The two passes agree on every clause. Cost $0.05. Results in `dryrun/results/jev.jsonl`.
