# Provider note for run r1 (written before any reader call)

**What changed.** PREREG.md (section 1, "Reader") names OpenRouter's OpenAI-compatible API as the host and
`nvidia/nemotron-3-ultra-550b-a55b:free` as the model. OpenRouter's free tier allows 50 calls a day (1,000 after a
one-time $10 purchase), which puts the 696 reader calls at about 14 days. On 2026-10-19 the owner chose to call NVIDIA's
own free API instead (`https://integrate.api.nvidia.com/v1`, key from build.nvidia.com, repository secret
`NVIDIA_API_KEY`), which serves the same model as `nvidia/nemotron-3-ultra-550b-a55b`.

**What did not change.** The kit (manifest md5 `7174064e8c592ab4e6a33a124a1fca21`), the runner
(`outside_review_runner.py`, md5 `7d952ac48d8e3483f417d9f1e00479f9`), PREREG.md and every rule in it. The host, key,
model id, request rate and concurrency are set by environment variables in the workflow; no code was edited.

**What may differ, and is reported if it does.** The model is the same, but the host is not: the served model id, the
accepted request parameters (`reasoning`, `seed`, `max_tokens` of 32,000) and the output-token cap may differ from
OpenRouter's. Each reader line records `model_requested`, `model_served` and the `params` sent. If the host rejects or
ignores a parameter, or cuts an answer short, the dry run shows it first; any parameter change after the dry run is a
deviation and is reported beside the result, as PREREG.md's header requires. A run that starts on one host and finishes
on another is not pooled (PREREG.md, section 1: a changed model or host makes a new run, r2).

**Not verified before the dry run.** NVIDIA's daily or credit limits on the free tier, and the model's output-token cap.
