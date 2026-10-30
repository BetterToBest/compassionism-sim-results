# compassionism-sim-results
For saving studies. One folder per study, `<study>-<engine commit, 7 characters>/`, with `run.txt` (what was run, on which engine commit, with which command) and `SHA256SUMS` beside the results. A file `DONE` means every piece is in.

## Running a study on GitHub Actions
`.github/workflows/run-study.yml` (workflow `run-study`, dispatch by hand or through the API) cuts a seed range into shards and runs each on its own GitHub-hosted runner, in a clean checkout of a pinned engine commit of BetterToBest/compassionism-simulation. A last job checks every shard and commits the folder to `main`.

| Input | Meaning |
|---|---|
| `study` | study id: lower case letters, digits, hyphens |
| `engine` | engine commit, 40 hex characters |
| `job` | a script in `runner/jobs/` (default `release-pair.js`) |
| `job_args` | its arguments besides `--seeds` and `--out` (for `release-pair.js`: `--env=ref|adv|st --adults=N --years=Y --procs=K`) |
| `seeds` | seed range `A-B` |
| `shards` | number of shards, 1 to 256 |

A job script is run in the engine checkout as `node runner/jobs/<job> <job_args> --seeds=A-B --out=shard-NNNN.json` and must write that file with deterministic content only (no clock, no machine) plus `shard-NNNN.timing.json` beside it. `runner/check-shards.js` then checks every shard before anything is committed. How a session uses this: research-update `prereg/RUNNING.md`.
