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

Codex uses skill mention style: `$plannable`.

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

Cursor should support Plannable through Agent Skills and optional slash-command wrappers.

## Shared Workflow

The workflow is the same everywhere:

1. Create a plan.
2. Run the next part.
3. Implement the scenario outcome.
4. Add evidence.
5. Check status and verify.

