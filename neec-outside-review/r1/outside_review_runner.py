#!/usr/bin/env python3
"""
outside_review_runner.py -- NEEC: the outside blind review's runner (Session 80; decisions 79.6, 79.8; ledger S63)
=================================================================================================================
Runs unattended (a scheduled GitHub Actions job in BetterToBest/compassionism-sim-results, folder
neec-outside-review/<run id>/), with no Claude session in the loop. Standard library only.

It reads the kit (outside_kit/, built by outside_kit.py in NormativeEvaluation and copied unchanged; its
manifest.json is checked on start), and for each unit in the kit's order:
  reader   assembles the blind prompt from the kit alone (build_messages), calls the pinned model through an
           OpenAI-compatible chat API, takes the object after the last "FINAL:", validates it (validate), and on an
           invalid answer asks twice more with the errors named; appends one line to results/reader.jsonl.
  jev      for every unit with a source pack, one Jev call with one choice question per clause (cleared, short,
           not_shown), the pack held fixed as the state; two passes; appends to results/jev.jsonl.
  stage B  (not blind, labelled so) for the eight owner-decided units, once their blind reading was already in the
           results when this run started (so it was pushed by an earlier run): the same conversation, then the
           argument made for a different reading; appends to results/stage_b.jsonl.
Resumable: a unit already answered (valid or invalid after three attempts) is skipped; an error is retried on the
next run. Writes heartbeat.json (counts by group, cost, last error, why it stopped); commits and pushes results/ and
the heartbeat every PUSH_EVERY seconds and at the end when run with --push.

Environment (secrets are set in the repository's settings, never committed):
  READER_API_KEY      the free tier's key (OpenRouter by default)             required for the reader
  READER_BASE_URL     default https://openrouter.ai/api/v1
  READER_MODEL        the pinned model id (decision 80.4)                    required for the reader
  READER_MAX_TOKENS 32000   READER_TEMPERATURE 0.6   READER_SEED 80   READER_REASONING_EFFORT high
  READER_RPM 15   READER_CONCURRENCY 2
  TYPESAFE_API_KEY    Jev                                                     required for Jev
  JEV_MODEL jev-1.13.0   JEV_PASSES 2   JEV_BUDGET_USD 5   JEV_PRICE_IN 0.042   JEV_PRICE_OUT 0.20 ($ per M tokens)
  JEV_MAX_CHARS 200000 (a longer pack is cut at that length, and the cut recorded)
  RUN_MINUTES 330   PUSH_EVERY 1200

Usage:
  python3 outside_review_runner.py [--kit DIR] [--out DIR] [--only reader|jev|stageb] [--units U,U,...] [--push]
  python3 outside_review_runner.py --selftest [--kit DIR]   offline: prompt assembly, the FINAL parser, the
                                                             validator, resume and the stage B gate on fixtures
"""
import hashlib
import json
import os
import re
import subprocess
import sys
import threading
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

HERE = os.path.dirname(os.path.abspath(__file__))
STATUSES = ("cleared", "short", "not_shown", "moot")


# ---- the kit and the prompt ------------------------------------------------------------------------------------

def load_kit(kit):
    man = json.load(open(os.path.join(kit, "manifest.json")))
    bad = [p for p, h in man["files"].items()
           if hashlib.md5(open(os.path.join(kit, p), "rb").read()).hexdigest() != h]
    if bad:
        raise SystemExit("kit differs from its manifest: %s" % ", ".join(bad[:5]))
    units = [json.loads(l) for l in open(os.path.join(kit, "units.jsonl"))]
    return man, units


def text(kit, rel):
    with open(os.path.join(kit, rel), encoding="utf-8") as f:
        return f.read()


def pack_text(kit, u):
    parts = [text(kit, "files/%s.txt" % fid).strip() for fid in u["files"]]
    return "\n\n-----\n\n".join(parts)


def build_messages(kit, u):
    """The blind prompt for unit u, from the kit alone: the instructions as the system message; the rules, the
    criterion, the system and the source pack as the user message. Nothing else is read."""
    head = []
    if u["mode"] == "closed-book":
        head.append("This unit is closed-book: the pack holds no document of this system's own, so read the "
                    "system's literature and record from your own knowledge and say so in each source. Any shared "
                    "data below may still be used.")
    if u["unreadable"]:
        head.append("%d cached source(s) could not be included (scanned documents with no text layer)."
                    % len(u["unreadable"]))
    pack = pack_text(kit, u) if u["files"] else "(empty)"
    user = "\n\n".join([
        text(kit, "prompt/protocol.md").strip(),
        "# The criterion\n\n" + text(kit, "criteria/%s.md" % u["cid"]).strip(),
        "# The system\n\n" + text(kit, "systems/%s.md" % u["code"]).strip(),
        "# The source pack\n\n" + ("\n".join(head) + "\n\n" if head else "") + pack,
        "Read unit %s on criterion %s now, and end with the FINAL: line." % (
            text(kit, "systems/%s.md" % u["code"]).split("\n", 1)[0].lstrip("# ").strip(), u["cid"])])
    return [{"role": "system", "content": text(kit, "prompt/instructions.md")},
            {"role": "user", "content": user}]


def stage_b_message(kit, u):
    arg = text(kit, "stage_b/%s__%s.md" % (u["code"], u["cid"])).split("\n", 2)[2].strip()
    who = ("It was made by the evaluation's owner, who is also the designer of this system."
           if u["code"] == "CCO" else
           "It was made by the evaluation's owner, as a rule for every system whose clauses show this pattern.")
    return ("Stage B (not blind). Your reading above is stored as given. You are now shown an argument made for a "
            "different reading of this unit. %s\n\n%s\n\nDoes it change your reading? Reason, then end with FINAL: "
            "and the whole object again (it may be unchanged)." % (who, arg))


# ---- FINAL parsing and validation ------------------------------------------------------------------------------

def parse_final(content):
    i = (content or "").rfind("FINAL:")
    if i < 0:
        return None, ["no FINAL: line"]
    s = content[i + 6:]
    j = s.find("{")
    if j < 0:
        return None, ["no JSON object after FINAL:"]
    depth, k, instr, esc = 0, j, False, False
    while k < len(s):
        ch = s[k]
        if instr:
            if esc:
                esc = False
            elif ch == "\\":
                esc = True
            elif ch == '"':
                instr = False
        elif ch == '"':
            instr = True
        elif ch == "{":
            depth += 1
        elif ch == "}":
            depth -= 1
            if depth == 0:
                break
        k += 1
    try:
        return json.loads(s[j:k + 1]), []
    except ValueError as e:
        return None, ["the object after FINAL: is not valid JSON (%s)" % e]


def validate(obj, nclauses):
    errs = []
    if not isinstance(obj, dict):
        return ["FINAL is not an object"]
    cl = obj.get("clauses")
    if not isinstance(cl, list) or len(cl) != nclauses:
        errs.append("clauses must be a list of exactly %d entries" % nclauses)
        cl = cl if isinstance(cl, list) else []
    for i, c in enumerate(cl, 1):
        if not isinstance(c, dict):
            errs.append("clause %d is not an object" % i); continue
        if c.get("n") != i:
            errs.append("clause %d: n must be %d" % (i, i))
        if c.get("status") not in STATUSES:
            errs.append("clause %d: status must be one of %s" % (i, ", ".join(STATUSES)))
        for f in ("estimate", "source"):
            if not isinstance(c.get(f), str) or not c.get(f).strip():
                errs.append("clause %d: %s must be a non-empty string" % (i, f))
    v = obj.get("verdict")
    if v not in (1.0, 0.5, 0.0) or isinstance(v, bool):
        errs.append("verdict must be 1.0, 0.5 or 0.0")
    elif not errs:
        all_clear = all(c["status"] in ("cleared", "moot") for c in cl)
        if all_clear and v != 1.0:
            errs.append("every clause is cleared or moot, so the verdict must be 1.0 (protocol 2.3)")
        if not all_clear and v == 1.0:
            errs.append("a clause is not cleared or moot, so the verdict cannot be 1.0 (protocol 2.3)")
    zb = obj.get("zero_basis", "missing")
    if v == 0.0 and not (isinstance(zb, str) and zb.strip()):
        errs.append("a 0.0 verdict needs zero_basis naming the 0.0 condition (protocol 2.1)")
    if v in (1.0, 0.5) and zb is not None:
        errs.append("zero_basis must be null unless the verdict is 0.0")
    if not isinstance(obj.get("closed_book"), bool):
        errs.append("closed_book must be true or false")
    cf = obj.get("confidence")
    if cf is not None and not (isinstance(cf, (int, float)) and 0 <= cf <= 1):
        errs.append("confidence must be a number from 0 to 1")
    return errs


# ---- results, resume, heartbeat, push --------------------------------------------------------------------------

class Results:
    def __init__(self, out):
        self.out = out
        os.makedirs(os.path.join(out, "results"), exist_ok=True)
        self.lock = threading.Lock()
        self.files = {k: os.path.join(out, "results", k + ".jsonl") for k in ("reader", "jev", "stage_b")}
        self.rows = {k: self._read(p) for k, p in self.files.items()}
        self.at_start = {r["unit"] for r in self.rows["reader"] if r["status"] == "ok"}
        self.notes = {"last_error": None, "stopped": {}}

    @staticmethod
    def _read(p):
        return [json.loads(l) for l in open(p)] if os.path.exists(p) else []

    def done(self, kind, key):
        return any(self._key(kind, r) == key and r["status"] in ("ok", "invalid") for r in self.rows[kind])

    @staticmethod
    def _key(kind, r):
        return r["unit"] if kind != "jev" else (r["unit"], r["pass"])

    def add(self, kind, row):
        with self.lock:
            self.rows[kind].append(row)
            with open(self.files[kind], "a") as f:
                f.write(json.dumps(row, ensure_ascii=False, sort_keys=True) + "\n")
            if row["status"] == "error":
                self.notes["last_error"] = "%s %s: %s" % (kind, row["unit"], row.get("error"))

    def heartbeat(self, units, run_id):
        def latest(kind):
            last = {}
            for r in self.rows[kind]:
                last[self._key(kind, r)] = r["status"]
            return last
        rd, jv, sb = latest("reader"), latest("jev"), latest("stage_b")
        groups = {}
        for u in units:
            g = groups.setdefault(str(u["group"]), {"units": 0, "ok": 0, "invalid": 0, "error": 0})
            g["units"] += 1
            st = rd.get(u["unit"])
            if st:
                g[st] += 1
        cost = sum(r.get("cost_usd", 0) for r in self.rows["jev"])
        hb = {"updated": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()), "run": run_id,
              "reader": {"done": sum(1 for s in rd.values() if s in ("ok", "invalid")), "of": len(units),
                         "by_group": groups},
              "jev": {"done": sum(1 for s in jv.values() if s == "ok"), "cost_usd": round(cost, 4)},
              "stage_b": {"done": sum(1 for s in sb.values() if s in ("ok", "invalid"))},
              "last_error": self.notes["last_error"], "stopped": self.notes["stopped"]}
        with open(os.path.join(self.out, "heartbeat.json"), "w") as f:
            f.write(json.dumps(hb, indent=1, sort_keys=True) + "\n")
        return hb


def git_push(out, message):
    """Commit results/, the heartbeat and DONE, and push to the branch the job runs on (GITHUB_REF_NAME)."""
    def run(*a):
        return subprocess.run(["git", "-C", out] + list(a), capture_output=True, text=True)
    branch = os.environ.get("GITHUB_REF_NAME") or run("rev-parse", "--abbrev-ref", "HEAD").stdout.strip()
    run("add", "results", "heartbeat.json", *(["DONE"] if os.path.exists(os.path.join(out, "DONE")) else []))
    if run("diff", "--cached", "--quiet").returncode == 0:
        return True
    run("commit", "-q", "-m", message)
    for attempt in range(4):
        if run("push", "-q", "origin", "HEAD:refs/heads/" + branch).returncode == 0:
            return True
        run("pull", "-q", "--rebase", "origin", branch)
        time.sleep(2 ** (attempt + 1))
    return False


# ---- HTTP -----------------------------------------------------------------------------------------------------

def post(url, headers, body, timeout=900):
    req = urllib.request.Request(url, data=json.dumps(body).encode(), headers=dict(headers, **{
        "Content-Type": "application/json"}), method="POST")
    try:
        with urllib.request.urlopen(req, timeout=timeout) as r:
            return r.status, dict(r.headers), json.loads(r.read().decode())
    except urllib.error.HTTPError as e:
        raw = e.read().decode(errors="replace")
        try:
            data = json.loads(raw)
        except ValueError:
            data = {"raw": raw[:2000]}
        return e.code, dict(e.headers), data
    except Exception as e:  # network errors, timeouts
        return 0, {}, {"error": repr(e)[:500]}


class Limiter:
    def __init__(self, rpm):
        self.gap, self.next, self.lock = 60.0 / max(1, rpm), 0.0, threading.Lock()

    def wait(self):
        with self.lock:
            now = time.time()
            t = max(now, self.next)
            self.next = t + self.gap
        time.sleep(max(0, t - now))


class Stop(Exception):
    pass


# ---- the reader -----------------------------------------------------------------------------------------------

class Reader:
    def __init__(self, env):
        self.base = env.get("READER_BASE_URL", "https://openrouter.ai/api/v1").rstrip("/")
        self.model, self.key = env.get("READER_MODEL"), env.get("READER_API_KEY")
        self.params = {"max_tokens": int(env.get("READER_MAX_TOKENS", 32000)),
                       "temperature": float(env.get("READER_TEMPERATURE", 0.6)),
                       "seed": int(env.get("READER_SEED", 80))}
        if env.get("READER_REASONING_EFFORT", "high"):
            self.params["reasoning"] = {"effort": env.get("READER_REASONING_EFFORT", "high")}
        self.limiter = Limiter(int(env.get("READER_RPM", 15)))
        self.stopped = None

    def call(self, messages):
        """(status, headers, data) after waiting out per-minute limits; Stop on a daily cap or a missing model."""
        for wait_round in range(6):
            if self.stopped:
                raise Stop(self.stopped)
            self.limiter.wait()
            code, hdr, data = post(self.base + "/chat/completions",
                                   {"Authorization": "Bearer " + self.key,
                                    "HTTP-Referer": "https://github.com/BetterToBest/compassionism-sim-results",
                                    "X-Title": "NEEC outside review"},
                                   dict(self.params, model=self.model, messages=messages))
            msg = json.dumps(data)[:600].lower()
            if code == 429:
                if "per-day" in msg or "per day" in msg or "daily" in msg or "free-models-per-day" in msg:
                    self.stopped = "daily limit reached (429): " + msg[:200]
                    raise Stop(self.stopped)
                ra = hdr.get("Retry-After") or hdr.get("retry-after")
                time.sleep(min(300, float(ra) if ra and ra.replace(".", "").isdigit() else 60))
                continue
            if code in (404, 401, 403) or ("no endpoints" in msg):
                self.stopped = "model or key unavailable (%s): %s" % (code, msg[:200])
                raise Stop(self.stopped)
            if code == 200 and isinstance(data, dict) and data.get("error"):
                code = int(data["error"].get("code", 502)) if str(data["error"].get("code", "")).isdigit() else 502
            if code in (0, 500, 502, 503, 504, 520, 524):
                time.sleep(30 * (wait_round + 1))
                continue
            return code, hdr, data
        return code, hdr, data

    def read_unit(self, messages, nclauses):
        attempts, convo = [], list(messages)
        for attempt in range(3):
            code, hdr, data = self.call(convo)
            rec = {"http": code, "t": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())}
            if code != 200:
                rec["error"] = json.dumps(data)[:500]
                attempts.append(rec)
                return None, None, attempts, "error"
            ch = (data.get("choices") or [{}])[0]
            content = (ch.get("message") or {}).get("content") or ""
            usage = data.get("usage") or {}
            rec.update(model_served=data.get("model"), provider=data.get("provider"),
                       finish=ch.get("finish_reason"), tokens_in=usage.get("prompt_tokens"),
                       tokens_out=usage.get("completion_tokens"), content=content)
            obj, errs = parse_final(content)
            errs = errs or validate(obj, nclauses)
            rec["errors"] = errs
            attempts.append(rec)
            if not errs:
                return obj, content, attempts, "ok"
            convo = convo + [{"role": "assistant", "content": content or "(empty)"},
                             {"role": "user", "content": "Your FINAL object cannot be accepted: %s. Give the whole "
                              "answer's FINAL: line again, corrected, and nothing after it." % "; ".join(errs)}]
        return None, None, attempts, "invalid"


# ---- Jev ------------------------------------------------------------------------------------------------------

def jev_request(kit, u, crit_text, model, max_chars):
    name = text(kit, "systems/%s.md" % u["code"]).split("\n", 1)[0].lstrip("# ").strip()
    pack = pack_text(kit, u)
    cut = len(pack) > max_chars
    clauses = [l.split(". ", 1)[1] for l in crit_text.split("**Pass Threshold, clause by clause**", 1)[1]
               .split("**Anchor bands**")[0].strip().split("\n")[1:] if re.match(r"\d+\. ", l)]
    title = crit_text.split("\n", 1)[0].lstrip("# ").strip()
    qs = {}
    for n, cl in enumerate(clauses, 1):
        qs["clause%d" % n] = {"type": "choice", "instructions": (
            "The system is %s. The criterion is %s. The clause under test is \"%s\". Judge only from the state "
            "(the system's description and the source pack); do not use outside knowledge about the system. A "
            "source about a different system or economy does not show anything about this one." % (name, title, cl)),
            "criteria": {
                "cleared": "The sources show this system meeting the clause, by a figure, record or documented "
                           "feature of this system that meets it.",
                "short": "The sources show this system's performance or design on the clause, and it falls short "
                         "of what the clause requires.",
                "not_shown": "The sources do not let the clause be judged for this system: they are silent on it "
                             "or speak only of other systems."}}
    state = {"system": text(kit, "systems/%s.md" % u["code"]).strip(), "criterion": crit_text.strip(),
             "source_pack": pack[:max_chars]}
    return {"model": model, "state": state, "questions": qs}, cut, len(clauses)


def run_jev(kit, units, res, env, deadline):
    key = env.get("TYPESAFE_API_KEY")
    if not key:
        res.notes["stopped"]["jev"] = "no TYPESAFE_API_KEY"
        return
    model, passes = env.get("JEV_MODEL", "jev-1.13.0"), int(env.get("JEV_PASSES", 2))
    budget = float(env.get("JEV_BUDGET_USD", 5))
    pin, pout = float(env.get("JEV_PRICE_IN", 0.042)), float(env.get("JEV_PRICE_OUT", 0.20))
    max_chars = int(env.get("JEV_MAX_CHARS", 200000))
    for p in range(1, passes + 1):
        for u in units:
            if u["mode"] != "sources" or u["unit"].endswith("#2") or res.done("jev", (u["unit"], p)):
                continue
            spent = sum(r.get("cost_usd", 0) for r in res.rows["jev"])
            if spent >= budget:
                res.notes["stopped"]["jev"] = "budget of $%.2f reached" % budget
                return
            if time.time() > deadline:
                res.notes["stopped"]["jev"] = "time"
                return
            body, cut, k = jev_request(kit, u, text(kit, "criteria/%s.md" % u["cid"]), model, max_chars)
            code, hdr, data = post("https://api.typesafe.ai/v1/systemone", {"Authorization": "Bearer " + key}, body,
                                   timeout=300)
            usage = data.get("usage") or {} if isinstance(data, dict) else {}
            cost = (usage.get("input_tokens", 0) * pin + usage.get("output_tokens", 0) * pout) / 1e6
            ok = code == 200 and isinstance(data.get("answers"), dict) and len(data["answers"]) == k
            res.add("jev", {"unit": u["unit"], "pass": p, "status": "ok" if ok else "error", "http": code,
                            "model_served": data.get("model") if isinstance(data, dict) else None,
                            "answers": data.get("answers") if ok else None, "usage": usage,
                            "cost_usd": round(cost, 6), "pack_cut": cut,
                            "request_md5": hashlib.md5(json.dumps(body, sort_keys=True).encode()).hexdigest(),
                            "error": None if ok else json.dumps(data)[:500],
                            "t": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())})
            if code in (401, 402, 403):
                res.notes["stopped"]["jev"] = "key refused (%d)" % code
                return


# ---- main -----------------------------------------------------------------------------------------------------

def main(argv):
    args = {"--kit": os.path.join(HERE, "outside_kit"), "--out": HERE}
    flags = set()
    i = 0
    while i < len(argv):
        if argv[i] in ("--kit", "--out", "--only", "--units"):
            args[argv[i]] = argv[i + 1]; i += 2
        else:
            flags.add(argv[i]); i += 1
    if "--selftest" in flags:
        return selftest(args["--kit"])
    env = os.environ
    kit, out = args["--kit"], args["--out"]
    man, units = load_kit(kit)
    if "--units" in args:
        want = args["--units"].split(",")
        units = [u for u in units if u["unit"] in want]
    only = args.get("--only")
    res = Results(out)
    run_id = env.get("GITHUB_RUN_ID", time.strftime("%Y%m%dT%H%M%S", time.gmtime()))
    start = time.time()
    deadline = start + 60 * float(env.get("RUN_MINUTES", 330))
    push_every = float(env.get("PUSH_EVERY", 1200))
    last_push = [start]
    push_lock = threading.Lock()

    def maybe_push(final=False):
        with push_lock:
            _maybe_push(final)

    def _maybe_push(final):
        res.heartbeat(units, run_id)
        if "--push" in flags and (final or time.time() - last_push[0] > push_every):
            if not git_push(out, "outside review: run %s, %s" % (run_id, "final" if final else "progress")):
                res.notes["last_error"] = "push failed"
            last_push[0] = time.time()

    print("kit %s, %d calls in order; results in %s" % (man["version"], len(units), os.path.join(out, "results")))
    if only in (None, "jev"):
        run_jev(kit, units, res, env, deadline)
        maybe_push()
    if only in (None, "reader", "stageb"):
        if not (env.get("READER_API_KEY") and env.get("READER_MODEL")):
            res.notes["stopped"]["reader"] = "no READER_API_KEY or READER_MODEL"
        else:
            rd = Reader(env)
            todo = [u for u in units if not res.done("reader", u["unit"])] if only != "stageb" else []

            def one(u):
                if time.time() > deadline or rd.stopped:
                    return
                try:
                    obj, content, attempts, st = rd.read_unit(build_messages(kit, u), u["clauses"])
                except Stop:
                    return
                res.add("reader", {"unit": u["unit"], "order": u["order"], "group": u["group"], "status": st,
                                   "model_requested": rd.model, "params": rd.params, "final": obj,
                                   "attempts": attempts})
                maybe_push()

            with ThreadPoolExecutor(max_workers=int(env.get("READER_CONCURRENCY", 2))) as ex:
                list(ex.map(one, todo))
            if rd.stopped:
                res.notes["stopped"]["reader"] = rd.stopped
            # stage B: only units whose blind reading was already stored when this run began
            for u in units:
                key = "%s|%s" % (u["code"], u["cid"])
                if (u["unit"] != key or not os.path.exists(os.path.join(kit, "stage_b", "%s__%s.md" % (
                        u["code"], u["cid"]))) or key not in res.at_start or res.done("stage_b", key)
                        or rd.stopped or time.time() > deadline):
                    continue
                blind = next(r for r in res.rows["reader"] if r["unit"] == key and r["status"] == "ok")
                convo = build_messages(kit, u) + [
                    {"role": "assistant", "content": blind["attempts"][-1]["content"]},
                    {"role": "user", "content": stage_b_message(kit, u)}]
                try:
                    obj, content, attempts, st = rd.read_unit(convo, u["clauses"])
                except Stop:
                    break
                res.add("stage_b", {"unit": key, "status": st, "blind_verdict": blind["final"]["verdict"],
                                    "model_requested": rd.model, "final": obj, "attempts": attempts})
    if time.time() > deadline:
        res.notes["stopped"]["time"] = "run time of %s minutes reached" % env.get("RUN_MINUTES", 330)
    if "--units" not in args and is_done(kit, units, res, env):
        with open(os.path.join(out, "DONE"), "w") as f:
            f.write("every call answered (%s)\n" % time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()))
    maybe_push(final=True)
    hb = res.heartbeat(units, run_id)
    print("reader %d of %d; jev %d; stage B %d; stopped: %s" % (
        hb["reader"]["done"], hb["reader"]["of"], hb["jev"]["done"], hb["stage_b"]["done"],
        json.dumps(hb["stopped"]) or "-"))
    return 0


def is_done(kit, units, res, env):
    """Every reader call answered or invalid, both Jev passes over every pack, and stage B for the eight."""
    passes = int(env.get("JEV_PASSES", 2))
    reader = all(res.done("reader", u["unit"]) for u in units)
    jev = all(res.done("jev", (u["unit"], p)) for u in units if u["mode"] == "sources" and not u["unit"].endswith("#2")
              for p in range(1, passes + 1))
    sb = all(res.done("stage_b", "%s|%s" % (u["code"], u["cid"])) for u in units
             if os.path.exists(os.path.join(kit, "stage_b", "%s__%s.md" % (u["code"], u["cid"])))
             and not u["unit"].endswith("#2"))
    return reader and jev and sb


def selftest(kit):
    import tempfile
    fails = []

    def check(cond, what):
        print(("PASS  " if cond else "FAIL  ") + what)
        if not cond:
            fails.append(what)

    man, units = load_kit(kit)
    u = next(x for x in units if x["code"] == "SQ" and x["cid"] == "C1.1")
    m = build_messages(kit, u)
    check(len(m) == 2 and m[0]["role"] == "system" and "# The source pack" in m[1]["content"],
          "build_messages: the instructions, then rules, criterion, system and pack in one user message")
    good = {"clauses": [{"n": 1, "status": "short", "estimate": "x", "source": "y"},
                        {"n": 2, "status": "not_shown", "estimate": "x", "source": "y"}],
            "verdict": 0.5, "zero_basis": None, "closed_book": False, "confidence": 0.6, "note": ""}
    obj, e = parse_final("reasoning...\nFINAL: " + json.dumps(good))
    check(obj == good and not e and not validate(obj, 2), "a valid FINAL object parses and validates")
    obj, e = parse_final("FINAL: ```json\n" + json.dumps(good) + "\n```")
    check(obj == good, "a FINAL object inside a code fence parses")
    bad = dict(good, verdict=1.0)
    check(any("cannot be 1.0" in x for x in validate(bad, 2)), "1.0 with a clause short is refused (2.3)")
    allc = dict(good, clauses=[dict(c, status="cleared") for c in good["clauses"]])
    check(any("must be 1.0" in x for x in validate(allc, 2)), "0.5 with every clause cleared is refused (2.3)")
    check(any("zero_basis" in x for x in validate(dict(good, verdict=0.0), 2)), "0.0 without zero_basis is refused")
    check(any("exactly 3" in x for x in validate(good, 3)), "a wrong clause count is refused")
    check(parse_final("no final here")[0] is None, "an answer without FINAL: is refused")
    with tempfile.TemporaryDirectory() as d:
        r = Results(d)
        r.add("reader", {"unit": "SQ|C1.1", "status": "error", "error": "x"})
        check(not r.done("reader", "SQ|C1.1"), "an error is retried on the next run")
        r.add("reader", {"unit": "SQ|C1.1", "status": "ok", "final": good, "attempts": []})
        r2 = Results(d)
        check(r2.done("reader", "SQ|C1.1") and "SQ|C1.1" in r2.at_start,
              "resume: a stored reading is skipped, and counts as pushed for stage B in the next run")
        hb = r2.heartbeat(units, "t")
        check(hb["reader"]["done"] == 1 and hb["reader"]["of"] == len(units), "the heartbeat counts by unit")
        check(not is_done(kit, units, r2, {}), "the run is not done while calls remain")
    sb = [x for x in units if os.path.exists(os.path.join(kit, "stage_b", "%s__%s.md" % (x["code"], x["cid"])))
          and not x["unit"].endswith("#2")]
    check(len(sb) == 8, "stage B covers the eight owner-decided units")
    check(all("Stage B (not blind)" in stage_b_message(kit, x) for x in sb), "stage B is labelled not blind")
    body, cut, k = jev_request(kit, next(x for x in units if x["mode"] == "sources"),
                               text(kit, "criteria/C1.1.md"), "jev-1.13.0", 200000)
    check(k == 2 and set(body["questions"]) == {"clause1", "clause2"}, "Jev: one choice question per clause")
    print("SUMMARY: %d failed" % len(fails))
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
