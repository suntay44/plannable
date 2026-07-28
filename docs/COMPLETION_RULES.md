# Completion Rules

Plannable completion is evidence-based.

## A Part Is Complete Only When

- The scenario outcome is implemented.
- The `AC` acceptance criteria in the `.ai.md` file are satisfied or explained.
- The `V` verification commands are run or marked unavailable with a reason.
- Evidence is added to `PLAN_EVIDENCE.md`.
- Evidence contains a non-empty summary plus at least one completed artifact, changed file, check, or note.
- If a verification step cannot run, evidence names the unavailable step and explains why; “manual verification pending” is not completion evidence.
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

Use `--unavailable "reason"` only when a planned verification step genuinely cannot run:

```bash
plannable evidence PART-001 "Implemented and reviewed the parser." \
  --check "npm test" \
  --unavailable "Windows symlink QA requires a Windows runner"
```
