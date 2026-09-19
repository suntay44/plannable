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

`create` reads available `package.json` scripts (`typecheck`, `lint`, `test`, `build`) once and selects npm/pnpm/yarn/bun from an explicit `packageManager` or an unambiguous lockfile; npm is the fallback for a manifest without either. It lists existing common source/test directories as candidate paths. It does not execute scripts, infer a framework, or verify tool availability. Unknown checks remain an instruction to identify them, not invented npm commands. Invalid JSON fails before plan files are written.

If display-name normalization changes the input, each part retains the original request as a JSON string in `CTX`; agents must respect its flags and exclusions when enriching scenario hints.

## Run-Next Workflow

`plannable run-next` reads `MASTER_PLAN.md`, finds the first unchecked part, prints the part number, scenario, path, outcome, and the single compressed part file to load.

## Verify Workflow

`plannable verify` checks required files, PlannablePlan headers, required symbolic blocks, evidence log structure, and whether checked-off parts have matching evidence.

## Compress Workflow

`plannable compress plan.md` converts a Markdown-ish task file into `plan.ai.md` using the symbolic PlannablePlan v0.1 structure, mapping task/acceptance/verification/context/stop sections into the right blocks and reporting estimated token savings. Prose and fenced code are retained; explicit verification commands are no longer marked optional automatically. Unclosed fences fail before output is written. Existing v0.1 content is preserved when recompressed, and the CLI validates it before writing. Copied task/acceptance text produces an advisory warning.

This is a limited Markdown importer, not a lossless Markdown document round-trip: list hierarchy and rich formatting are not reconstructed. Review the output before implementing.

## Expand Workflow

`plannable expand plans/PART1_PLAN.ai.md` expands a compressed PlannablePlan file into readable Markdown with scenario, goal, outcome, tasks, acceptance criteria, verification, completion updates, and stop conditions. Fenced code is restored with its original indentation; numeric names such as `2FA` remain intact.

## Status Workflow

`plannable status` reads `MASTER_PLAN.md`, `PLAN_STATE.md`, and `PLAN_EVIDENCE.md`, then prints completed parts, pending parts, next active part, and missing evidence for completed work.

## Evidence Workflow

`plannable evidence PART-001 "summary" --artifact "npm test"` appends evidence for a real part in `PLAN_EVIDENCE.md`.

## Complete Workflow

`plannable complete PART-001` checks that evidence exists, checks off the matching part in `MASTER_PLAN.md` and `PLAN_STATE.md`, marks evidence as recorded, and advances the current part.

Completion is not a transaction across files. Each file replacement is atomic individually: optional `--summary` evidence is saved first, then `MASTER_PLAN.md`, then the derived `PLAN_STATE.md`. A failed command can therefore leave recorded evidence or completion behind.

If the master is saved but the state update fails, `complete` exits with code 1 and explains that completion was recorded, including the original write error. This also applies with `--json`: failures remain text on stderr with no success JSON on stdout. Resolve the filesystem problem first, then run:

```bash
plannable repair
plannable verify
```

With the existing plan files readable and writable, repair rebuilds state from the master and evidence. It cannot fix permissions, unavailable storage, or missing source files. Retrying `plannable complete PART-001` also synchronizes state without duplicating existing substantive evidence, including when repeated with `--summary`. Verify consistency before continuing: `run-next` reads the master and can already select the following part while state is stale.

## Doctor Workflow

`plannable doctor` prints status and verification together. Use it before handing a plan back to a human or before starting end-to-end testing.

Use `plannable doctor --json` when an agent needs machine-readable status and verification output.

## Repair Workflow

`plannable repair` syncs evidence markers in `MASTER_PLAN.md` and regenerates `PLAN_STATE.md` from `MASTER_PLAN.md` and `PLAN_EVIDENCE.md` (the sources of truth). It does not invent missing evidence or complete work.

## Planning safeguards

New drafts include routine secret handling and behavior-check requirements. Declared package dependencies add dependency-review guidance. The CLI does not infer accounts, private data or providers from names/dependencies. During existing enrichment, agents inspect scope and use the installed skill’s relative guidance references for conditional rules. See [the guidance contract](GUIDANCE.md).

`expand` retains the C constraints block; Markdown constraint sections import into C. Rule-tag diagnostics are advisory; they neither execute checks nor certify security. Distinguish planned safeguards from implemented changes and observed check results.
