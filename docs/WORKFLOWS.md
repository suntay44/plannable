# Workflows

## Human Workflow

1. Create a plan with `plannable create "<software plan>"`.
2. Read `MASTER_PLAN.md`.
3. Ask an agent to run the next part.
4. Review evidence in `PLAN_EVIDENCE.md`.
5. Accept completion only when evidence is present.

## Agent Workflow

1. Run `plannable run-next`.
2. Read the single printed PlannablePlan part.
3. Implement the scenario outcome.
4. Run focused verification.
5. Add evidence with `plannable evidence PART-001 "summary"`.
6. Mark the part complete with `plannable complete PART-001`.
7. Run `plannable verify`.

## Progressive Context Loading

Agents should avoid loading all part files at once. Each part has enough compressed context to complete one scenario-driven outcome.

## Create Workflow

`plannable create "<software plan>"` writes `MASTER_PLAN.md`, `PLAN_STATE.md`, `PLAN_EVIDENCE.md`, and `plans/PART*_PLAN.ai.md` files in the current directory.

## Run-Next Workflow

`plannable run-next` reads `MASTER_PLAN.md`, finds the first unchecked part, prints the part number, scenario, path, outcome, and the single compressed part file to load.

## Verify Workflow

`plannable verify` checks required files, PlannablePlan headers, required symbolic blocks, evidence log structure, and whether checked-off parts have matching evidence.

## Compress Workflow

`plannable compress plan.md` converts a Markdown-ish task file into `plan.ai.md` using the symbolic PlannablePlan v0.1 structure, mapping task/acceptance/verification/context sections into the right blocks and reporting estimated token savings.

## Expand Workflow

`plannable expand plans/PART1_PLAN.ai.md` expands a compressed PlannablePlan file into readable Markdown with scenario, goal, outcome, tasks, acceptance criteria, and verification.

## Status Workflow

`plannable status` reads `MASTER_PLAN.md`, `PLAN_STATE.md`, and `PLAN_EVIDENCE.md`, then prints completed parts, pending parts, next active part, and missing evidence for completed work.

## Evidence Workflow

`plannable evidence PART-001 "summary" --artifact "npm test"` appends evidence for a real part in `PLAN_EVIDENCE.md`.

## Complete Workflow

`plannable complete PART-001` checks that evidence exists, checks off the matching part in `MASTER_PLAN.md` and `PLAN_STATE.md`, marks evidence as recorded, and advances the current part.

## Doctor Workflow

`plannable doctor` prints status and verification together. Use it before handing a plan back to a human or before starting end-to-end testing.

Use `plannable doctor --json` when an agent needs machine-readable status and verification output.

## Repair Workflow

`plannable repair` syncs evidence markers in `MASTER_PLAN.md` and regenerates `PLAN_STATE.md` from `MASTER_PLAN.md` and `PLAN_EVIDENCE.md` (the sources of truth). It does not invent missing evidence or complete work.
