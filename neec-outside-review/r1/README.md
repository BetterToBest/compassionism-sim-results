# NEEC outside blind review, run r1

An independent reader from outside the Claude family reads every unit of the NEEC evaluation (23 systems on 29
criteria, 667 units) blind, from the kit in `kit/`, and Jev (TypeSafe) checks each clause's status against the same
source pack. The plan is `NEEC_OutsideReview_Plan_s79.md` and the comparison rules, fixed before any call, are
`PREREG.md` (both in BetterToBest/NormativeEvaluation).

- `kit/`: everything the reader is shown, built by `outside_kit.py` in NormativeEvaluation (its `manifest.json` lists
  each file's md5; the runner refuses a kit that differs). Never edit it here.
- `outside_review_runner.py`: the runner (standard library only), a copy of NormativeEvaluation's.
- `results/reader.jsonl`, `results/jev.jsonl`, `results/stage_b.jsonl`: one line per call, appended.
- `heartbeat.json`: units done by priority group, Jev's cost, the last error, and why the last run stopped.
- `DONE`: written when every call is answered; the workflow then disables its schedule.
- `dryrun/`: the dry run's results, kept apart from the run's.

The workflow is `.github/workflows/neec-outside-review.yml`.
