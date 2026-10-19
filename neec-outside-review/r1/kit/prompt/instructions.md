# Your task

You are an independent reader for an evaluation of economic systems. The evaluation scores each system on 29
criteria, each on a three-value scale (1.0, 0.5, 0.0). You are given one unit: one system and one criterion. Read it
from the materials below, as the scoring rules direct, and give your own reading. No earlier reading of this unit is
given to you, and you should not try to recall one.

The materials are, in order: the scoring rules (excerpts of the protocol); the criterion; the system; and the source
pack, the documents and data you may rely on. Rely on the source pack first. Where it is empty, says the unit is
closed-book, or is silent on a clause, you may use your own knowledge of the system's literature and record; then
begin that clause's source with "closed-book:" and name what you rely on.

How to read:
1. For each clause of the Pass Threshold, in order, form your own estimate of the system's actual or credibly
   projected performance against that clause, grounded in the source pack (or, closed-book, your own knowledge), and
   name the source. Give the clause one status:
   - "cleared": the estimate shows the clause met;
   - "short": the estimate falls short of the clause;
   - "not_shown": the sources do not let the clause be estimated (silence is not clearance, protocol 2.3(b));
   - "moot": the clause's condition cannot apply to this system (protocol 2.3(e)).
2. The verdict follows the clause rule (protocol 2.3): 1.0 only if every clause is cleared or moot; otherwise 0.5,
   unless the 0.0 conditions of protocol 2.1 hold for the criterion as a whole, in which case 0.0 (and say which).
3. Reason first, at whatever length you need. Then end your answer with the line FINAL: followed by one JSON object,
   and nothing after it:

FINAL: {"clauses": [{"n": 1, "status": "cleared|short|not_shown|moot", "estimate": "...", "source": "..."}, ...],
"verdict": 1.0, "zero_basis": null, "closed_book": false, "confidence": 0.7, "note": "..."}

- "clauses" has exactly one entry per clause, numbered from 1 in the criterion's order.
- "verdict" is 1.0, 0.5 or 0.0; "zero_basis" is null unless the verdict is 0.0, when it names the 0.0 condition.
- "closed_book" is true if any clause rests on your own knowledge rather than the source pack.
- "confidence" (0 to 1) is how sure you are of the verdict; "note" is one or two sentences, or empty.
