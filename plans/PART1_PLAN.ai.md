@PlannablePlan v0.1

ID=PART-001
PH=PUBLIC_LAUNCH_HARDENING
SCN=SCN-001
OUT=Safety and correctness guarantees hold
DEP=[]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- Maintainer hardens plan execution

CTX:
- product: Plannable — command-driven planning skill and TypeScript CLI for AI coding agents
- phase: Public Launch Hardening (part 1/3)
- prior: none — this is the first part
- next: PART-002 covers "Release and maintenance automation works"

C:
- preserve-existing-work
- avoid-unrelated-edits
- ask-before-new-deps

F:
+ src/core/filesystem.ts
+ src/core/evidence.ts
+ src/commands/run-next.ts
+ src/commands/status.ts
+ src/commands/verify.ts
+ tests/core.test.ts
+ tests/cli.test.ts
? docs/COMPLETION_RULES.md
? docs/COMMANDS.md

T:
1 confine:master-part paths to the project and refuse symlink escapes
2 fix:verify compares PLAN_STATE status and metadata against MASTER_PLAN
3 strengthen:evidence requires a substantive summary and completed verification artifact or explicit unavailable reason
4 harden:writes use atomic replacement and reject symlink targets
5 add:regression tests for traversal, symlink writes, state drift, and weak evidence

AC:
- `run-next` and `verify` reject part paths outside the project.
- writes to Plannable source-of-truth files refuse symbolic-link targets and replace regular files atomically.
- `verify` fails when PLAN_STATE checkbox, scenario, outcome, or path differs from MASTER_PLAN.
- completion cannot be earned from an empty evidence heading or pending manual verification.
- all new failure modes have end-to-end regression tests.

V:
- npm run typecheck
- npm test
- npm run build

DONE:
- update MASTER_PLAN.md Part 1=[x]
- append PLAN_EVIDENCE.md#PART-001 with files+checks+notes
- run plannable repair to regenerate PLAN_STATE.md, or update current_part=PART-002

S:
- preserve valid hand-written PlannablePlan parsing behavior
- do not add runtime dependencies
