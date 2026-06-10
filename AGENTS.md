# AGENTS.md

Plannable is a command-driven planning skill and CLI for AI coding agents.

## Agent Rules

- This repo builds Plannable.
- Keep files small and agent-readable.
- Prefer examples over abstract theory.
- Do not create giant Markdown documents.
- Keep the human-facing plan short and scenario driven in `MASTER_PLAN.md`.
- Keep `.ai.md` files compressed but semantically readable.
- Load only one compressed `plans/PART*_PLAN.ai.md` file at a time.
- All `.ai.md` plan parts must start with `@PlannablePlan v0.1`.
- Do not call the compressed format PlanPack.
- Use `PlannablePlan` as the format name.
- Refer to domain-specific generation nudges as scenario hints, not presets or product templates.
- Do not use binary/base64/gzip as the default planning format.
- Mark a part complete only after adding evidence to `PLAN_EVIDENCE.md`.
- Prefer concrete verification artifacts: tests, screenshots, command output, changed file paths, or manual QA notes.
- Do not promise exact slash-command support where the platform does not support it.
- Be honest about platform-specific launchers.

## Command Styles

Terminal CLI:

```txt
plannable create "CRM"
plannable run-next
plannable status
plannable verify
plannable evidence PART-001 "summary"
plannable complete PART-001
plannable doctor
plannable doctor --json
plannable repair
```

Codex:

```txt
$plannable create a CRM
$plannable run-next
$plannable status
$plannable verify
```

Claude Code:

```txt
/plannable create a CRM
/plannable run-next
/plannable status
/plannable verify
```

Cursor:

```txt
/plannable create a CRM
/plannable run-next
/plannable status
/plannable verify
```
