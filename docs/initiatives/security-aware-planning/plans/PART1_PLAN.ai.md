@PlannablePlan v0.1

ID=PART-001
PH=FOUNDATION
SCN=SCN-001
OUT=Routine safeguards are selected with minimal user input
DEP=[]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion; S=stop

G:
- Select routine safeguards without requiring an owner to know or request technical security controls.

CTX:
- product: strengthen planning guidance and truthful discovery; existing CLI and execution flow stay intact
- phase: 1/3; prior: none; next: integrate guidance into existing blocks and enrichment
- initiative cwd: docs/initiatives/security-aware-planning; repo root: ../../..; F paths below are repo-relative
- supporting detail: DESIGN.md, DEFAULTS.md, VALIDATION.md, SOURCES.md; do not load later part files
- current implementation: deterministic create/context and scenario hints; no security applicability engine

C:
- Preserve commands/options, three-part draft, v0.1, evidence semantics and zero runtime dependencies.
- Use trusted first-party data only; no remote rule loading, project script execution or new onboarding flow.
- Unknown facts stay unknown; distinguish guidance from verified security and user intent from inferred signals.

F:
+ src/core/guidance/types.ts
+ src/core/guidance/select.ts
+ templates/guidance/
+ tests/guidance.test.ts
? CONTRIBUTING.md
? scripts/check-package.mjs

T:
1 Define module schema and text-tag grammar: stable requirement ID/revision, expected active IDs in CTX, applicability/exclusions, source/version/date, decision class (default/inspect/owner), constraints, tasks, AC/V and stops.
2 Author six modules and minimum coverage from DEFAULTS.md: secrets, dependencies/config, permissions/sessions, injection-safe input, paths/uploads/URLs, private data/recovery, integrations/resource limits and quality. Verify specialized sources; keep unreviewed adapters outside claimed coverage.
3 Implement deterministic selection: routine applicable controls included automatically, technical unknowns request inspection, unresolved product choices request plain-language decisions. Preserve exclusions; unknown is not absent or approved.
4 Add fixtures from VALIDATION.md including security never mentioned, owner unsure, scope changes and unnecessary-question cases, alongside static/local/CRM/webhook/unsupported-stack/exclusion cases.
5 Document contributor source/attribution review, module revision/deprecation, freshness checks and one failure-case example per requirement.

AC:
- Every shipped module has a source, bounded scope, negative fixture and actionable AC/check; no blanket secure/certified claim.
- Static/local fixtures receive no accounts, servers or payments; confirmed private CRM includes ownership denial and legitimate access cases.
- Package presence alone cannot assert protections or scope; identical confirmed facts produce stable selection/ordering.
- Owners are never asked whether routine safeguards should exist; technical facts are inspected first; only unresolved consequential product choices need owner input. “Not sure” does not authorize exposure/deletion/cost.
- Expected rule IDs and mapping diagnostics have a concrete syntax; inconsistent/missing tags can be tested without semantic security claims.
- All DEFAULTS.md coverage rows have at least one applicable and one irrelevant-context fixture; unsupported details remain explicit.
- Adding a reviewed module needs data and focused fixtures, not edits to domain scenario hints or command definitions.

V:
- From initiative cwd: npm --prefix ../../.. run check
- Review VALIDATION.md selection cases and source mappings; report unsupported cases rather than inventing outcomes.

DONE:
- In initiative PLAN_EVIDENCE.md record files, executed checks/results, source review and limits for PART-001.
- From initiative cwd run node ../../../dist/cli.js complete PART-001 only after evidence; leave root launch plan unchanged.

S:
- Resolve source-license/version uncertainty before bundling content.
- If the design needs new commands, mandatory user files or executable/remote modules, revise it to fit the stated scope.
