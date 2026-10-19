# NEEC outside blind review: the pre-registered comparison (Session 80)

**Status.** Committed in Session 80, before any reader call (plan, section 6; decision 79.6). Session 81's
`compare_outside.py` implements these rules as written; a rule changed after the first reader call is reported as a
deviation, with its reason, beside the result under the rule as registered. Nothing here changes a score.

## 1. What is fixed

| Item | Value |
|---|---|
| Kit | `outside_kit/`, manifest md5 `7174064e8c592ab4e6a33a124a1fca21` (250 files; 696 reader calls in order, 294 Jev units, 8 stage B units) |
| Runner | `outside_review_runner.py`, md5 `7d952ac48d8e3483f417d9f1e00479f9`, copied unchanged to the results repository |
| Leak check | `outside_kit_check.py` (md5 `861b4730`): every prompt built by the runner's functions, 0 hits; seven planted leaks caught |
| NEEC's scores compared | `neec_corpus_v2.json`, md5 `4a1a26af0b01b6a561364e37a4a409b1` (the Session 79 standing) |
| NEEC without the owner's decisions | `neec_corpus_v2_s78_snapshot.json` (md5 `ab3dbc90`) with CCO-PTF-CIP-SZH's C3.2 set to 0.5 (decision 58.1 undone; group 2.5's reading, decision 57.7) |
| Close calls (priority group 3) | `summary_blocks_v2.json`, md5 `dfb3d89880d4fbba6b8e6c20389288a8` |
| Reader | one model for the whole run, through OpenRouter's OpenAI-compatible API: by default `nvidia/nemotron-3-ultra-550b-a55b:free` (decision 80.4); temperature 0.6, seed 80, reasoning effort high, up to 32,000 output tokens. The model the first results line records is the run's pin |
| Jev | `jev-1.13.0`, two passes over each of the 294 units with a source pack, one choice question per clause (cleared, short, not_shown) |
| Results | `BetterToBest/compassionism-sim-results`, `neec-outside-review/r1/results/` (`reader.jsonl`, `jev.jsonl`, `stage_b.jsonl`) |

A model withdrawn or changed mid-run ends run r1. A run with another model is a new run (`r2`), never pooled with r1;
if r1 has not finished group 4, r2 reads every unit again from the start of the order, so its lean is measured on its
own readings.

## 2. Status codes

NEEC's clause statuses map one to one: C cleared, S short, U not shown, M moot. A reader verdict is the `verdict` of
its validated FINAL object. A unit whose three attempts were all invalid, or that errored and was never answered, is
**missing**: counted and listed, never imputed, and left out of every rate's denominator.

## 3. Primary outcome: verdict agreement

- A unit **agrees** when the reader's verdict equals NEEC's published verdict (`neec_corpus_v2.json`). Rates are reported
  by priority group (1, 2, 3, 4), by system, by criterion, for all answered units, and separately for closed-book units
  (`closed_book` true) and the rest.
- **Direction.** Each disagreement is "up" (the reader higher) or "down", with its size (0.5 or 1.0).
- **Against NEEC without the owner's decisions** (section 1): the same tables, so the eight owner-decided units show how
  the reader stands to both readings.
- **Clause agreement** is reported beside the verdict wherever NEEC's records give clause statuses (the units the pass,
  the blind groups and the owner's decisions read clause by clause); elsewhere it is "not recorded".

## 4. The reader's lean, and CCO-PTF-CIP-SZH against it

- **Calibration set:** the 387 group 4 units (no close call; not CCO-PTF-CIP-SZH or the other four of the top five).
- **Lean** = the mean of (reader verdict minus NEEC verdict) over a set's answered units. The calibration lean says how
  generous or strict the reader is against NEEC in general.
- **CCO-PTF-CIP-SZH's lean** (its 29 units, first reading) is reported with the calibration lean and their difference,
  with a 95% bootstrap interval for the difference (10,000 resamples of units within each set, seed 80). A difference
  whose interval excludes 0 is reported as the reader reading CCO-PTF-CIP-SZH differently from the rest; it is a
  finding for Session 82 to examine, not a verdict.
- The same is reported for each of the other four top-five systems, and for the eight owner-decided units as a set.

## 5. The reader's own consistency

CCO-PTF-CIP-SZH's 29 units are read twice (calls 146 to 174 of the order, after groups 1 and 2; the repeat is "#2"). Reported: verdict agreement between the two readings and clause-status agreement. Only the first
reading enters sections 3, 4 and 7.

## 6. Jev

- For each clause of the 294 units with a pack: Jev's choice (the option with the highest probability) in each pass;
  agreement between passes; agreement with the reader's status and with NEEC's (where recorded).
- Jev reads only the pack, so a reader's "cleared" resting on closed-book knowledge is expected to meet Jev's
  "not_shown"; those clauses are reported apart.
- Jev never sets a verdict. In adjudication (section 8) a clause where Jev and the reader agree against NEEC is read
  first.

## 7. The standing, three ways

1. NEEC's scores (the Session 79 standing).
2. NEEC's scores without the owner's decisions (section 1).
3. The reader's: its verdicts on the units it answered, NEEC's on the missing ones, with the number of each per
   system; and, separately, the totals over the units every system has answered, so no system gains from another's
   missing units.

For each: totals, ranks, tiers (failures counted as 0.0 verdicts, protocol 2.5), and whether first place changes.

## 8. What follows (Session 82)

- Every verdict disagreement is adjudicated on the sources, by one rule for every entry: the protocol as written, the
  unit's pack, the reader's stated estimates and sources, Jev's clause choices, and NEEC's record of the unit. An
  adjudication may hold NEEC's verdict, adopt the reader's, or reach a third reading.
- Changes go in by generator, never by hand. Changes to CCO-PTF-CIP-SZH's units go to the owner (decision 57.2); a
  fall in CCO-PTF-CIP-SZH's score is held for the site's push-back feature under decision 69.4/D38, but is published in
  the record either way.
- **Whatever the owner decides, the Report and Paper publish the outside reader's result for every CCO-PTF-CIP-SZH unit
  and every owner-decided unit, up or down** (plan, section 6), with stage B's result beside it.

## 9. Stage B (not blind)

For the eight owner-decided units (CCO-PTF-CIP-SZH C3.2, C1.2a, C2.5, C3.4; Integral, Participatory Economics, Degrowth
Economics and Ostrom-Style Commons Governance C3.4), after the blind reading is stored and pushed, the reader is shown
the argument made for the owner's reading (`outside_kit/stage_b/`, naming who made it) and asked whether it changes its
reading. Reported: each verdict before and after. Stage B never enters sections 3 to 7.

## 10. What the reader is shown and not shown

As `outside_kit.py`'s header and the plan's section 3 say: the protocol's rules (sentences naming a system, a record or
a session dropped without a marker), the criterion without its worked examples, the system's name, kind and
configuration, and the source pack (decision 80.3); never a score, verdict, status, flag, close call, total, rank, tier,
rationale, record, the name NEEC, or the author's name. `outside_kit_check.py` is in the harness and fails on any of
these.
