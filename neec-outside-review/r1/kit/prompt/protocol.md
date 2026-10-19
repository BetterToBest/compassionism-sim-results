# The scoring rules

Excerpts of the evaluation's scoring protocol: the scale and the clause rule (2.1 to 2.3), scope (3.1, 3.2), evidence (4.1, 4.2) and anchors (4.6). Sentences that refer to particular systems, earlier documents or internal procedures have been left out; no rule is changed. Section numbers are the protocol's own; cross-references to sections not included can be ignored.

### 2.1 The scale

Each criterion receives exactly one of three values:

- **1.0 — Pass.** The system robustly and structurally satisfies the criterion's Pass Threshold, under normal conditions and, where the criterion specifies one, under stress. This is a claim that the threshold is cleared, not a claim of perfection.
- **0.5 — Partial / Conditional.** A genuine, non-trivial mechanism that does not clear the threshold robustly: the performance falls short of the threshold's figure, or holds only under favourable or untested conditions, or covers only part of the relevant population, or the sources are genuinely ambiguous (in which case the score is flagged, 6.1).
- **0.0 — Structural Failure.** No structural mechanism addresses the criterion; or the system excludes the criterion's concern as illegitimate; or the best evidence shows performance far below the threshold with no credible pathway to close the gap under the system's own logic.

Two decisions refine the 0.0 band. **D29** (4.1) says what counts as "the system's own logic" when implementations of a system have failed, and when a remedy is the system's own. **D26** narrows the band for one criterion: C3.2 reserves 0.0 for an active inflationary mechanism with no counterbalancing element, and scores the absence of any inflation-control mechanism 0.5 (4.6).

### 2.2 Reason continuously, then round once

For each criterion, first form a continuous or ranged estimate of where the system's actual or credibly projected performance falls against the Pass Threshold, grounded in the best available evidence, and write it down ("Estimated performance"). Only then round it to the nearest valid value. Where the estimate straddles a boundary, state the range and say so; that is also the first sign that the call may need a flag (6.1). Rounding happens once, at the criterion level.

### 2.3 The operative threshold, clause by clause (decision D28, revision R4)

Twenty-four criteria have a Pass Threshold of more than one clause; Appendix B splits each into its clauses, verbatim and in order. Five have one clause (C1.2a, C1.2b, C1.5, C2.2, C3.3).

- **(a) Clause by clause.** Where a Pass Threshold has several clauses, 1.0 requires every clause to be shown cleared on its own estimate (2.2). The criterion's section states an estimate for each clause, in Appendix B's order.
- **(b) Silence is not clearance.** A clause the document does not estimate cannot support a 1.0.
- **(c) Reach.** For a mechanism, a clause whose quantity the mechanism does not govern even when generalised cannot be credited (3.2).
- **(d) Method clauses.** A clause that names how a condition is evidenced ("validated through revealed preference", "validated through modeling") is satisfied by evidence at least as strong as the method named. Observed operation at the relevant scale is at least as strong as modelling.
- **(e) Moot clauses.** A clause whose condition cannot apply to the entry, as its document establishes, does not block a 1.0 — a transition, scale-up or coordination the document shows is not needed. The same reading is applied to every entry of the same class.
- **(f) 0.0 is unchanged.** 2.1's 0.0 conditions apply to the criterion as a whole. A clause-level gap alone never makes 0.0, so this rule cannot change a failure count or a tier.
- **(g) Anchors describe; thresholds govern** (4.6).

A criterion whose clauses are not all shown cleared scores 0.5, unless 2.1's 0.0 conditions hold for the criterion as a whole.

### 3.1 The three scope classes

Every entry declares exactly one scope class before scoring.

- **Mechanism** — an institution, instrument or policy family that operates inside a wider economy without itself specifying that economy.
- **Configured national economy** — an existing or historical national political economy, scored as configured at a stated date.
- **Comprehensive system** — a design or vision for a whole economy, scored as its own sources specify it.

### 3.2 How population-scope thresholds are applied

Many thresholds refer to "the population", "participants" or "residents". The protocol, not the scorer, decides how they are read:

- **Configured national economy:** everyone who lives and works in the economy, non-citizens included. Narrower populations — citizens only; citizens and permanent residents — are scenarios (6.5): never scores, never flags.
- **Mechanism: generalisation, not best-casing.** Score the mechanism as though it governed every part of an economy it could govern, then apply the population-scope thresholds to the resulting economy-wide population. Credit a country's outcomes to the mechanism only where the mechanism does the work ("score the mechanism, not a country"). Whether an adjacent instrument or extension lies inside the mechanism's boundary is settled by the extension test below; the other reading is a scenario.
- **Comprehensive system:** the population the system's own sources claim to serve, ordinarily a whole society. Where the sources are ambiguous about who is covered, apply the ambiguity rule (4.2): the ambiguity becomes a flagged call, not a change of scope.

**Reach (decision D28(c)).** For a mechanism, a clause of a Pass Threshold whose quantity the mechanism does not govern even when generalised cannot be credited, since crediting it would credit the host economy. Such a clause holds the criterion at 0.5 at most (2.3); it does not by itself make the criterion 0.0.

**Extensions (decision D31, revision R6).** An institution, programme or domain beyond a mechanism's core cases belongs to the scored mechanism when the mechanism's own literature — its founding works and the scholarship that develops them — makes it part of the mechanism's design explicitly: by pairing it with the mechanism in the design itself, or by applying the mechanism's defining rules or principles to it one by one. It is scored out when that literature does neither, or when it disputes that the design transfers — a dispute within the mechanism's own literature, as distinct from critics' doubts that the mechanism works. An extension scored out is reported as a scope scenario counting it in; an extension scored in, as a scope scenario counting it out wherever that would change a score. The document cites the source that decides each extension; the scorer's own mapping, however careful, is argument rather than that source (4.3). the source this rule asks for is confirmed in the rescoring pass, section 13).

**Remedies from outside the scored system (decision D29(c)).** A remedy supplied from outside the entry's declared scope — for a mechanism, an instrument that the extension test places beyond its boundary; for a comprehensive system, one its own sources do not specify; for a configured national economy, one that is not part of the configuration at its stated date — is not credited to the entry. Where it would change a score, a scope scenario counts it in (4.1).

### 4.1 Evidentiary tier by type of system (Appendix H.6)

- **Real-world implementations:** score from documented outcomes. A 1.0 or a 0.0 should be traceable to a specific figure or well-established finding, not to reputation.
- **Historical or defunct systems:** score from the historical record, treating the actual trajectory, collapse included, as evidence.
- **Component-validated theoretical systems:** score the claimed mechanism, but calibrate confidence by the track record of the real-world components it cites — and treat each component's record as evidence only for the criteria it bears on.
- **Purely theoretical systems:** apply the same threshold reasoning, and let Domain 5 reflect the absence of deployment evidence honestly.

**Implementation failure and the system's own logic (decision D29, revision R2).** 2.1 places at 0.0 performance far below the threshold "with no credible pathway to close the gap under the system's own logic". For that test:

- **(a)** A failure documented in several independent implementations of the scored system — in different places, periods or hands — is evidence about the system's own logic, not a contingent shortfall of implementation, unless the document shows, from the system's own sources, that the failing implementations lacked or violated a feature the system requires. A single failed implementation is evidence of the same kind, but weaker; the document weighs it and says how.
- **(b)** A credible pathway is one the system provides: a rule, instrument or correction mechanism its own sources name, or, for a configured national economy, one in its configuration at the stated date. The expectation that later implementations will avoid a failure the earlier ones replicated is not a pathway.
- **(c)** A remedy supplied from outside the entry's declared scope is not credited to it (3.2); where it would change a score, a scope scenario counts it in.
- **(d)** Whether a remedy inside the scope works — in substance, not in form only — is a question of evidence, scored under this section and flagged where the evidence is divided (6.1).

### 4.2 Ambiguous source material

(1) State the interpretations the sources could support. (2) State which one the preponderance of the text supports, with the evidence. (3) Score against that reading. (4) State what the score would be under the alternative — that is, flag it (6.1) with the alternative score named.

### 4.6 Anchors (decisions D26, D28(g))

**C3.2 (decision D26, revision R3).** The 0.0 band is reserved for an active inflationary mechanism with no counterbalancing design element; a system that specifies no inflation-control mechanism of its own, or has no monetary function, scores 0.5, and the 0.5 band now says so.
