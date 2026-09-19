# Planning guidance

Guidance is first-party data in `templates/guidance/`: baseline, access, data, input, services and quality. It helps agents plan applicable safeguards; it does not scan or certify application code.

## Selection

Routine secret handling and changed-behavior checks apply to every draft. Conditional rules use confirmed facts, with an observed/user source and reason. Inferred or unknown facts request inspection or a product decision; missing facts are not proof that a feature is absent. Product names and package presence alone never establish a threat model.

Agents handle technical defaults without asking whether they should protect secrets or enforce permissions. Ask only unresolved product choices (intended access, retention, exposure, cost). “Not sure” is not consent to expose/delete data or add a feature. Preserve existing protections and legitimate behavior; resolve conflicts rather than silently weakening controls.

## Text contract inside v0.1

No new command or required block. For guidance-bearing parts:

- `CTX`: `guidance: v1; rules=baseline.secrets@1,quality.change@1` lists expected rule IDs/revisions.
- `CTX`: `basis[rule.id]: reason` records why each rule applies.
- Existing `C`, `T`, `AC`, `V` lines carry `[rule.id]` followed by actionable text.
- `CTX`: `decision[feature]: inspect or ask ...` records unresolved context; `S` repeats the relevant stop condition.

IDs are lowercase module/key pairs (`[a-z][a-z-]*\.[a-z][a-z-]*`); revisions are positive integers. Marker-scoped diagnostics check text coverage only. Removing every marker makes a plan indistinguishable from a legacy plan: the agent must still review actual applicability. Absence of warnings is not security assurance.

Each active part includes its required actions and checks; IDs/links alone are insufficient. Reassess when scope changes. Keep user decisions briefly in the master; do not load every part or the whole guidance library at once.

## Evidence and sources

Use existing evidence fields to record requirement ID, changed path, actual check/result, artifact and limitations. Planned, implemented, observed passing and unavailable are different. The CLI verifies evidence presence, not its truth; no security badge or stricter hidden completion gate is introduced.

Module sources and review dates are bundled. Wording is original, concise planning guidance, not copied standards or a claim of OWASP/NIST conformance. Framework/provider instructions require current official documentation for the actual stack.

## Contributing a rule

1. Add a stable ID, revision, reviewed date, primary-source URLs and applicability condition to the smallest matching module. New modules also need a catalog entry.
2. Write one constraint/action, positive-and-negative acceptance, and verification guidance; avoid executable script payloads or multiline fields.
3. Add confirmed, excluded, inferred and unknown-context fixtures. Show why the rule does not introduce an irrelevant feature.
4. Review sources, applicability, licenses and conflicts with a maintainer. Recheck on upstream changes and before releases; revise/deprecate visibly rather than silently editing saved plans.
5. Run `npm run guidance:sync` to regenerate the seven relative references for each platform from the canonical data. Package validation rejects stale mirrors. Run guidance tests and the full quality gate. Preserve zero runtime dependencies and installed-resource portability.
