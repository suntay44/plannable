# /plannable

Run a Plannable command.

Examples:

```txt
/plannable create a CRM
/plannable create an inventory management app
/plannable run-next
/plannable evidence PART-001 "Implemented and verified the active part"
/plannable complete PART-001
/plannable status
/plannable verify
```

Use the matching `plannable` CLI behavior in the current workspace.

Rules:

- Read `MASTER_PLAN.md` first.
- Load only the next unchecked part file.
- Do not require `init` before `create`.
- Do not check off work until evidence exists.
