# Install

Plannable has two install surfaces:

- the `plannable` terminal CLI
- agent skill files for Codex, Claude Code, and Cursor

Plannable is a skill, not a hosted plugin. In desktop agent apps, "install the plugin/skill" means installing or copying the matching `SKILL.md` folder, plus any platform command/rule files.

## Install the CLI from npm

Requires Node.js 18+.

```bash
npm install -g plannable
plannable --version
plannable create "CRM"
```

After the npm package is published, you can also run it without a global install:

```bash
npx plannable create "SaaS billing dashboard"
```

## Install the CLI from GitHub source

Use this path before npm publish, or when testing unreleased changes.

```bash
git clone https://github.com/suntay44/Plannable.git
cd Plannable
npm install
npm run build
npm link
plannable --version
```

Verify in a clean folder:

```bash
mkdir /tmp/plannable-smoke
cd /tmp/plannable-smoke
plannable create "backend API"
plannable run-next
plannable verify
```

## Ask an AI agent to install it

In Codex Desktop, Claude Code, Cursor, or another repo-aware agent, this is the plain-language install prompt:

```txt
Look at this GitHub repo and install Plannable for my current agent app:
https://github.com/suntay44/Plannable

Install the CLI if Node.js is available, copy the matching skill/commands/rules for this app, then run plannable --version and plannable create "CRM" in a temp folder to verify.
```

Shorter version:

```txt
Look at this GitHub repo and install Plannable:
https://github.com/suntay44/Plannable
```

## Codex Desktop or Codex CLI

Use the repo skill folder:

```txt
.agents/skills/plannable/
```

Some setups scan `.codex/skills`, so the repository also ships an identical mirror:

```txt
.codex/skills/plannable/
```

Suggested agent prompt:

```txt
Install the Plannable skill from https://github.com/suntay44/Plannable.
Use .agents/skills/plannable as the source; use .codex/skills/plannable only if this setup scans .codex/skills.
Also install or link the plannable CLI and verify with plannable --version.
```

Codex-style invocation:

```txt
$plannable create a CRM
$plannable run-next
$plannable status
$plannable verify
```

## Claude Code

Use:

```txt
.claude/skills/plannable/
```

Suggested agent prompt:

```txt
Install the Plannable Claude skill from https://github.com/suntay44/Plannable at .claude/skills/plannable.
Then install or link the CLI and verify with plannable --version.
```

Claude-style invocation:

```txt
/plannable create a CRM
/plannable run-next
/plannable status
/plannable verify
```

## Cursor

Use:

```txt
.cursor/skills/plannable/
.cursor/commands/
.cursor/rules/plannable.mdc
```

Cursor command files included:

- `.cursor/commands/plannable.md`
- `.cursor/commands/plannable-create.md`
- `.cursor/commands/plannable-run-next.md`
- `.cursor/commands/plannable-status.md`
- `.cursor/commands/plannable-verify.md`
- `.cursor/commands/plannable-evidence.md`
- `.cursor/commands/plannable-complete.md`
- `.cursor/commands/plannable-doctor.md`
- `.cursor/commands/plannable-repair.md`

Suggested agent prompt:

```txt
Install Plannable for Cursor from https://github.com/suntay44/Plannable.
Copy .cursor/skills/plannable, .cursor/commands, and .cursor/rules/plannable.mdc.
Then install or link the CLI and verify with plannable --version.
```

Cursor-style invocation:

```txt
/plannable create a CRM
/plannable run-next
/plannable status
/plannable verify
```

## Local Development

```bash
npm install
npm run typecheck
npm run build
npm run dev -- create "CRM"
```

## Verify the Install

Run these in any empty test folder:

```bash
plannable create "inventory management app"
plannable status
plannable run-next
plannable verify
```

Expected result:

- `MASTER_PLAN.md`, `PLAN_STATE.md`, `PLAN_EVIDENCE.md`, and `plans/` are created.
- `run-next` prints only the first pending `.ai.md` part.
- `verify` passes structurally. If the generated plan is generic, it may also warn that the draft should be enriched before implementation.
