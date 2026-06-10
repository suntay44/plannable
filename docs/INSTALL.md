# Install

## From npm

```bash
npm install -g plannable
```

Then run:

```bash
plannable create "CRM"
```

## From Source

```bash
git clone https://github.com/suntay44/Plannable.git
cd Plannable
npm install
npm run build
npm link
```

Then run:

```bash
plannable create "CRM"
```

## Local Development

```bash
npm install
npm run typecheck
npm run build
npm run dev -- create "CRM"
```

## Agent Skills

Plannable ships skill instructions for:

- Codex: `.agents/skills/plannable/SKILL.md`
- Claude Code: `.claude/skills/plannable/SKILL.md`
- Cursor: `.cursor/skills/plannable/SKILL.md`

Copy or reference the matching skill folder from this repository in the tool you use.

For Cursor, also copy or reference:

- `.cursor/commands/plannable.md`
- `.cursor/commands/plannable-create.md`
- `.cursor/commands/plannable-run-next.md`
- `.cursor/commands/plannable-status.md`
- `.cursor/commands/plannable-verify.md`
- `.cursor/commands/plannable-evidence.md`
- `.cursor/commands/plannable-complete.md`
- `.cursor/commands/plannable-doctor.md`
- `.cursor/commands/plannable-repair.md`
- `.cursor/rules/plannable.mdc`
