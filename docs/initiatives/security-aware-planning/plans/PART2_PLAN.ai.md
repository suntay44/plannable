@PlannablePlan v0.1

ID=PART-002
PH=INTEGRATION
SCN=SCN-002
OUT=Existing plans carry testable security and quality guidance
DEP=[PART-001]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion; S=stop

G:
- Give the coding agent relevant safeguards, failure cases and checks in its normal active part.

CTX:
- product: strengthen planning guidance and truthful discovery without changing the current workflow
- phase: 2/3; prior prerequisite: reviewed modules/selector from PART-001; confirm its evidence, do not assume completion
- next: release-backed examples and SEO/AEO; supporting detail: DESIGN.md, DEFAULTS.md and VALIDATION.md
- initiative cwd: docs/initiatives/security-aware-planning; repo root: ../../..; F paths below are repo-relative
- existing verify checks structure/state/evidence; complete checks evidence presence, not execution truth or application safety

C:
- Keep existing commands/options/JSON contracts/exit behavior, three-part drafts and v0.1 compatibility.
- No extra mandatory phase, prompt wizard, runtime dependency, scanner or completion gate.
- Load one part; inline required guidance rather than making IDs or external links the only instructions.

F:
? src/core/project-context.ts
+ src/core/guidance/render.ts
? src/core/plannable-plan.ts, src/core/markdown-import.ts
? src/commands/create.ts
? src/commands/verify.ts
? templates/PART_PLAN.ai.md
? .agents/skills/plannable/, .codex/skills/plannable/, .claude/skills/plannable/, .cursor/skills/plannable/
? scripts/check-package.mjs, tests/installation.test.ts, tests/cli.test.ts
+ tests/guidance-integration.test.ts

T:
1 Render confirmed applicable requirements into existing CTX/C/T/AC/V/S; retain original scenario tasks, request/exclusions and source/version markers; deduplicate per part.
2 Enhance existing enrichment: inspect technical facts, include routine controls without asking, ask only unresolved product choices, summarize defaults/decisions/unknowns, and check coverage before coding each active part.
3 Keep CLI drafts deterministic with baseline defaults and explicit unknowns; resolve intent during enrichment. When scope changes, refresh active requirements before coding new boundaries and record later implications in master without skipping part order.
4 Generate compact platform skill references from canonical module data; check mirror consistency and installed resource resolution without checkout paths.
5 Add marker-scoped advisory diagnostics for missing applicability/AC/check mappings and unresolved decisions; old plans and completion/evidence semantics remain unchanged.
6 Reproduce and fix C-block loss in expand/import; preserve applicable constraints and IDs through supported conversions with regression fixtures. Do not claim general Markdown round-trip fidelity.
7 Compare ordinary planning/current Plannable/enhanced Plannable on controlled cases; run negative tests with protections disabled in disposable fixtures; conduct usability pilot and measure full context.

AC:
- Each applicable requirement has a constraint/action, success/failure criterion and intended check in the active part even if security was never requested; no unnecessary technical questions.
- Expanded/imported plans retain the unique ownership constraint from the reproduced C-block failure, including its rule traceability; task/AC/V/stop preservation is tested.
- Scope-change fixtures gain relevant checks before development without adding unwanted features or changing execution order.
- Requests excluding accounts/payments retain exclusions; unknown membership rules prompt a decision instead of inventing authorization.
- Existing plan fixtures and JSON/exit contracts pass unchanged; no automatic rewrites of saved plans or loss of imported instructions.
- Local/global packed installs and copied skills resolve guidance outside checkout with spaces/custom paths; no remote dependencies required at runtime.
- Library/prompt evaluation reports relevant omissions and irrelevant additions separately; deterministic tests do not claim model reliability.
- Pilot results and full-context overhead are recorded with limits; necessary requirements are never removed to hit the proposed token review threshold.
- Evidence text links requirement ID, changed path, actual check/result and artifact/limits; fabricated success cannot be inferred from plan presence, changed code or an unavailable check. CLI attestation limits remain explicit.
- Three behavioral spot checks (ownership, injection-safe handling, local-file preservation) detect intentionally disabled controls; positive cases still work; report these separately from generated-plan tests.

V:
- From initiative cwd: npm --prefix ../../.. run check
- Run existing cross-platform CI and isolated installed-resource matrix; distinguish executed platforms from untested ones.
- Execute controlled baseline comparisons, behavioral fixtures and pilot from VALIDATION.md; record model/version/repeats, artifacts, participant count and all failures.

DONE:
- In initiative PLAN_EVIDENCE.md record changed files, checks/results, evaluation artifacts and remaining limitations for PART-002.
- From initiative cwd run node ../../../dist/cli.js complete PART-002 only after evidence; do not change root launch-plan completion.

S:
- If a diagnostic needs semantic certainty unavailable from metadata, keep it an explicit question rather than invent a security score.
- If required manual evaluation is unavailable, record it and keep readiness claims pending.
