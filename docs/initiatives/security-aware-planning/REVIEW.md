# Second review: reduce owner burden without false assurance

Reviewed 2026-09-17 against source revision `393ab96` and the entire initiative. Changes are planning-only; implementation remains pending.

| Priority | Gap in the previous draft | Updated plan |
| --- | --- | --- |
| High | Questions could make owners responsible for knowing which safeguards matter | Agent-owned defaults and inspect-first decision rules; only unresolved product choices need owner input |
| High | “Basic security” had categories but insufficient explicit coverage | DEFAULTS.md names concrete safeguards, applicability and failure/success examples within six modules |
| High | Applicable requirements could disappear during conversion | Reproduced current `expand` dropping C; Part 2 now includes preservation and a focused regression |
| High | Requirement presence could be confused with a tested implementation | Pre-coding coverage review, requirement-to-evidence references and planned/implemented/observed/unavailable distinctions; current CLI assurance limits remain explicit |
| Medium | Later scope changes could bypass initial selection | Reassess active-part requirements when new inputs/data/access/integrations appear; preserve part order and single-part loading |
| Medium | Positive-only tests and prose checks would not establish improvement | Controlled ordinary-agent/current/enhanced comparisons; negative tests with disabled controls, irrelevant-feature cases and non-technical comprehension pilot |
| Medium | SEO copy could promise reduced burden without demonstrating it | Claims follow released examples, comparison/pilot evidence and explicit limits; no security or ranking guarantee |

## Concrete reproduction

Used current built `compressToPlannablePlan` to create an in-memory valid plan, inserted `Do not expose customer records across businesses.` into its C block, then called `expandPlannablePlan`. Result:

```json
{"inputValid":true,"constraintInInput":true,"constraintInExpandedOutput":false}
```

Source confirms `expandPlannablePlan` emits context/tasks/acceptance/verification/completion/stops, without C. The Markdown importer maps constraint headings into context. No source fix is included in this planning update; Part 2 must address it before relying on those conversions for safeguards.

## Scope review

- Three implementation parts remain: modular defaults → integration and outcome evaluation → accurate discovery.
- Existing commands, flags, v0.1 required structure, part order and evidence/completion semantics remain intact. No compulsory questionnaire, new user files, scanner, hosted dependency or automatic publication.
- Advisory checks match explicit requirement tags, not inferred semantic security. Plans without guidance markers retain existing behavior.
- Routine technical work proceeds within confirmed scope; unresolved exposure/deletion/cost decisions remain visible and do not receive implied approval.
- Root launch-plan files are untouched. Implementation tests, user studies, framework mappings and live release checks remain future work, not claimed results.

Validation results are recorded in SOURCES.md after checking the revised artifact. This review is not a security audit of an application generated from the future guidance.
