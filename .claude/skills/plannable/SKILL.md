---
name: plannable
description: Scenario-driven planning workflow that creates MASTER_PLAN.md and compressed PlannablePlan .ai.md part files. Use when the user wants to create, split, run, verify, compress, expand, or status-check an implementation plan.
---

# Plannable

Use Plannable to create and execute scenario-driven plans progressively.

Humans read `MASTER_PLAN.md`. Claude Code should read only one compressed `plans/PART*_PLAN.ai.md` file at a time.

The compressed format is **PlannablePlan**. Do not call it PlanPack.

Every `.ai.md` file must start with:

```txt
@PlannablePlan v0.1
```

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

1. Read `MASTER_PLAN.md` and replace generic scenarios with product-specific ones the user actually described.
2. Update each `plans/PART*_PLAN.ai.md`: rewrite `G`, `T`, and `AC` lines with concrete product detail, and fill the `CTX` block with the detected stack and conventions.
3. Keep the `@PlannablePlan v0.1` structure intact, then run `plannable verify` — it warns on generic draft wording until the plan is enriched.

## CTX: Compressed Phase Context

Every part file carries a `CTX:` block so one part is enough context: the product goal, what prior parts delivered, and what the next part covers. Trust `CTX` instead of loading other part files.

## State Is Generated

`MASTER_PLAN.md` checkboxes and `PLAN_EVIDENCE.md` entries are the source of truth. `PLAN_STATE.md` is generated from them by `plannable evidence`, `plannable complete`, and `plannable repair`. Do not hand-edit `PLAN_STATE.md`; if it drifts, run `plannable repair`.

## Examples

```txt
/plannable create a CRM
/plannable create an inventory management app
/plannable run-next
/plannable evidence PART-001 "Implemented and verified the active part"
/plannable complete PART-001
plannable create "CRM"
plannable create "SaaS billing dashboard"
plannable run-next
plannable doctor
plannable doctor --json
plannable repair
```
