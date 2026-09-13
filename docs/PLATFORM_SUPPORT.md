# Platform Support

Plannable works across terminal CLIs and agent environments. The command launcher differs by platform.

## Terminal CLI

```txt
plannable create "CRM"
plannable run-next
plannable status
plannable verify
```

Terminal uses the real executable command: `plannable`.

## Codex

```txt
$plannable create a CRM
$plannable run-next
$plannable status
$plannable verify
```

Codex uses skill mention style: `$plannable`. Codex discovers repo skills from `.agents/skills/` (the official path per OpenAI's docs); Plannable also ships an identical mirror at `.codex/skills/` for setups that scan that location. Plannable is a skill (SKILL.md standard), not a plugin.

## Claude Code

```txt
/plannable create a CRM
/plannable run-next
/plannable status
/plannable verify
```

Claude Code can invoke skills directly with `/plannable`.

## Cursor

```txt
/plannable create a CRM
/plannable run-next
/plannable status
/plannable verify
```

Cursor discovers the standalone skill as `/plannable`. Optional legacy wrapper filenames yield `/plannable-create`, `/plannable-run-next`, etc.; these are not plugin namespaces. Actual Cursor UI discovery remains untested.

See [INSTALL.md](INSTALL.md) for personal/project paths, custom configuration directories, CLI prerequisites, ZIP distinctions, refresh, and uninstall.

## Shared Workflow

The workflow is the same everywhere:

1. Create a plan.
2. Run the next part.
3. Implement the scenario outcome.
4. Add evidence.
5. Check status and verify.

