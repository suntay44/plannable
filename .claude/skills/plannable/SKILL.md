---
name: plannable
description: Create and execute scenario-driven implementation plans with MASTER_PLAN.md, one PlannablePlan part at a time, and evidence-gated completion. Use for plannable create, run-next, status, verify, evidence, complete, compress, or expand.
---

# Plannable

Use Plannable to create and execute scenario-driven plans progressively.

Humans read `MASTER_PLAN.md`. Claude Code should read only one compressed `plans/PART*_PLAN.ai.md` file at a time.

The compressed format is **PlannablePlan**. Do not call it PlanPack.

Every `.ai.md` file must start with:

```txt
@PlannablePlan v0.1
```

The CLI is a separate prerequisite. Run it in the target project, not the skill folder. If `plannable` is not on PATH, use the project’s `node_modules/.bin/plannable` with the same arguments. If neither exists, report the missing CLI; do not silently fetch a package.

## Claude Code Command Style

```txt
/plannable create a CRM
/plannable run-next
/plannable status
/plannable verify
```

## Rules

- Treat `/plannable create a CRM` as `plannable create "CRM"`.
- Do not require `plannable init` before `plannable create`.
- Always read `MASTER_PLAN.md` first.
- Treat `/plannable run-next` as the command to load the next pending part.
- Never load all part files unless the user explicitly asks.
- Implement one part at a time.
- Do not edit unrelated files.
- Stop on stop conditions in the active part.
- Run listed verification commands where possible.
- Record evidence in `PLAN_EVIDENCE.md` before checking off work.
- Let `plannable evidence`/`plannable complete` regenerate `PLAN_STATE.md`; do not hand-edit it.
- Check off the matching part in `MASTER_PLAN.md` only after evidence exists.
- Run `plannable verify` before final completion.

## Enrich the Draft (Important)

`plannable create` writes a deterministic first draft. Scenario hints exist for common domains (CRM, TODO, restaurant, billing, mobile, API); everything else gets generic scaffold wording. Before implementing:

1. Read `MASTER_PLAN.md` and replace generic scenarios with product-specific ones the user actually described. Preserve any `CTX` request and user exclusions; revise conflicting scenario hints.
2. Enrich one part at a time: make `G` the user goal, `T` concrete actions, and `AC` observable results (include a failure case). Keep only relevant stack, conventions, and dependency facts in `CTX`; replace guesses in `F` and `V` with actual paths and checks.
3. Keep the `@PlannablePlan v0.1` structure intact, then run `plannable verify` — it warns on generic draft wording until the plan is enriched.

## CTX: Compressed Phase Context

Every part file carries a `CTX:` block so one part is enough context: the product goal, what prior parts delivered, and what the next part covers. Trust `CTX` instead of loading other part files. Reuse part content printed by `run-next`; do not reread it unless changed. Keep wording short; preserve commands, paths, constraints, and acceptance detail.

## State Is Generated

`MASTER_PLAN.md` checkboxes and `PLAN_EVIDENCE.md` entries are the source of truth. `PLAN_STATE.md` is generated from them by `plannable evidence`, `plannable complete`, and `plannable repair`. Do not hand-edit `PLAN_STATE.md`; if it drifts, run `plannable repair`.

## Examples

```txt
/plannable create a CRM
/plannable create an inventory management app
/plannable run-next
/plannable evidence PART-001 "Implemented and verified the active part" --artifact "npm test"
/plannable complete PART-001
plannable create "CRM"
plannable create "SaaS billing dashboard"
plannable run-next
plannable doctor
plannable doctor --json
plannable repair
```
