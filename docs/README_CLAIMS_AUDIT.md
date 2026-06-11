# README Claims Audit

This checks whether Plannable currently does what the README says.

## Status

Plannable is largely consistent with the README. The main unverified area is real desktop-app installation testing inside Codex, Claude Code, and Cursor. The repo ships the files and docs for those paths, but the actual app UIs still need manual end-to-end verification.

## Claim Checks

| README claim | Implementation evidence | Test coverage |
| --- | --- | --- |
| Turns a product idea into `MASTER_PLAN.md`, `PLAN_STATE.md`, `PLAN_EVIDENCE.md`, and `plans/PART*_PLAN.ai.md` | `src/commands/create.ts`, `src/core/master-plan.ts`, `src/core/state.ts`, `src/core/plannable-plan.ts` | `tests/cli.test.ts` create/status/verify/run-next tests |
| Uses compressed, readable PlannablePlan `.ai.md` files | `src/core/plannable-plan.ts`, `templates/PART_PLAN.ai.md` | CLI compression tests and core compression tests |
| Part files start with `@PlannablePlan v0.1` | `PLANNABLE_PLAN_HEADER` in `src/core/plannable-plan.ts` | validation and generated-part tests |
| Agents load one part at a time | `src/commands/run-next.ts` reads the current pending part only | `run-next` tests, JSON output tests |
| Each part carries enough context about the whole masterplan to work alone | `renderPartPlan` writes `CTX:` with product, phase, prior part, and next part | CTX creation tests |
| Nothing gets checked off without recorded evidence | `src/commands/complete.ts`, `src/core/progress.ts`, `src/core/evidence.ts` | evidence/complete tests, completed-without-evidence verify failure test |
| `PLAN_STATE.md` is generated from `MASTER_PLAN.md` and `PLAN_EVIDENCE.md` | `regenerateState` in `src/core/state.ts`, `plannable repair` | repair tests and core generated-state tests |
| `create` accepts any software plan, with sharper scenario hints for common domains | `src/core/templates.ts` model selection and fallback model | scenario-hint and arbitrary-plan tests |
| `verify` warns on generic scaffold wording | `src/commands/verify.ts`, `src/core/templates.ts` generic fallback language | generic warning tests |
| Status is grouped by masterplan phase | `parseMasterPartStatuses` and `src/commands/status.ts` | status grouping tests |
| JSON output exists for agent automation | `run-next`, `status`, `verify`, `doctor`, `repair` command handlers | JSON output tests |
| Skill instructions ship for Codex, Claude Code, and Cursor | `.agents/skills/plannable`, `.codex/skills/plannable`, `.claude/skills/plannable`, `.cursor/skills/plannable` | skill file alignment tests |
| Install docs cover CLI and desktop/agent skill usage | `docs/INSTALL.md` | documentation contract tests |

## Known Gaps Before Public Confidence

- Run the install flow inside real Codex Desktop, Claude Code, and Cursor sessions.
- Publish to npm, then retest `npm install -g plannable` and `npx plannable`.
- Improve semantic compression for large existing implementation plans.
- Add repair suggestions for failed checks beyond safe state/evidence drift.
