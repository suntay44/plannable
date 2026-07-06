# Commands

## `plannable create "<software plan>"`

Creates a scenario-driven plan in the current directory:

```txt
MASTER_PLAN.md
PLAN_STATE.md
PLAN_EVIDENCE.md
plans/
  PART1_PLAN.ai.md
  PART2_PLAN.ai.md
  PART3_PLAN.ai.md
```

Use `--force` to overwrite existing generated files.

The quoted argument can be any software product, feature, refactor, or implementation plan. `CRM`, `TODO app`, and `restaurant homepage` use scenario hints, but arbitrary plans fall back to useful create/manage/review scenario hints.

Scenario hints are domain nudges, not templates. They help Plannable produce sharper scenarios for familiar domains while keeping `create` open-ended for any software plan.

Examples:

```bash
plannable create "CRM"
plannable create "inventory management app"
plannable create "SaaS billing dashboard"
plannable create "mobile habit tracker"
plannable create "backend API"
```

## `plannable init`

Creates blank Plannable files in an existing project — no generated scenarios. The project label is picked up automatically from `package.json` (`name`) or the directory name, so this is usually all you need:

```bash
plannable init
```

Pass a name only to override the inferred label:

```bash
plannable init "Legacy Billing Service"
```

This is optional and advanced. New users should start with `plannable create "<software plan>"`.

## `plannable run-next`

Reads `MASTER_PLAN.md`, finds the first pending part, and prints only that `.ai.md` file.

Agents should use this command before implementation so they avoid loading the entire plan into context.

It prints:

- next unchecked part
- scenario id
- outcome
- part file path
- estimated token cost of loading the part
- agent instruction to load only that part

Use `--json` for machine-readable output.

## `plannable status`

Shows:

- total parts
- completed parts
- pending parts
- current part
- missing evidence
- checked parts without evidence
- evidence without checkbox

Use `--json` for machine-readable output.

## `plannable verify`

Checks that:

- required plan files exist
- every listed part file exists
- every `.ai.md` part starts with `@PlannablePlan v0.1`
- every part has required `ID`, `SCN`, `OUT`, `T`, `AC`, `V`, `DONE`, and `S` structure
- `MASTER_PLAN.md` and `PLAN_STATE.md` part checkboxes agree
- completed parts have evidence recorded
- evidence references a real part
- `PLAN_STATE.md` current part matches the next unchecked part

By default only failures, warnings, and a summary line are printed. Use `--verbose` to list every passing check, or `--json` for machine-readable output (always complete).

## `plannable evidence PART-001 "summary"`

Adds evidence to `PLAN_EVIDENCE.md` for a real part. Warns if the part already had evidence.

Examples:

```bash
plannable evidence PART-001 "Contact creation implemented and tested." --artifact "npm test"
plannable evidence P2 "Pipeline update manually verified." --file src/deals.ts --check "npm run build"
```

Use `--json` for machine-readable output.

## `plannable complete PART-001`

Checks off a part in `MASTER_PLAN.md`, marks evidence as recorded, and regenerates `PLAN_STATE.md` from the master plan and evidence log. Points to `plannable run-next` while parts remain, or `plannable verify` when the plan is done.

The part must already have evidence, unless you add it in the same command:

```bash
plannable complete PART-001 --summary "Contact creation verified." --artifact "npm test"
```

Use `--json` for machine-readable output.

## `plannable doctor`

Runs `status` and then `verify` so agents can see project health and structural failures in one command.

Use `--json` for machine-readable output.

## `plannable repair`

Repairs common safe drift:

- evidence exists but `MASTER_PLAN.md` still says `Evidence: pending`
- `PLAN_STATE.md` still says `Evidence: pending` after evidence was recorded
- `PLAN_STATE.md` drifted from `MASTER_PLAN.md` and `PLAN_EVIDENCE.md` (it is regenerated wholesale from them)

Examples:

```bash
plannable repair
plannable repair --dry-run
plannable repair --json
```

In `--json` output, `changed` means drift was found; `applied` means files were actually written (`false` under `--dry-run`).

## `plannable compress plan.md`

Converts a Markdown-ish task file into a first-version `plan.ai.md` PlannablePlan file next to the input.

## `plannable expand [path]`

Expands a compressed PlannablePlan file into a short human-readable summary.

## Platform Equivalents

Claude/Cursor:

```txt
/plannable create a CRM
```

Codex:

```txt
$plannable create a CRM
```

Terminal:

```txt
plannable create "CRM"
```
