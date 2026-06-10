# Completion Rules

Plannable completion is evidence-based.

## A Part Is Complete Only When

- The scenario outcome is implemented.
- The `AC` acceptance criteria in the `.ai.md` file are satisfied or explained.
- The `V` verification commands are run or marked unavailable with a reason.
- Evidence is added to `PLAN_EVIDENCE.md`.
- `PLAN_STATE.md` marks the part complete.
- `MASTER_PLAN.md` marks the matching part complete.
- `plannable verify` passes.

## Evidence Examples

- Passing test output
- Build output
- Screenshot paths
- Manual QA notes
- Changed file paths
- Before and after behavior notes

## Evidence Marker

For Part 1, use:

```md
### PART-001
```

Then describe what changed and how it was verified.
