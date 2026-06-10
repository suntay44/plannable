# Plannable

Plannable is a command-driven planning skill for AI coding agents.

It turns product ideas into scenario-driven master plans and compressed agent-readable part files, so AI agents can work progressively instead of drowning in giant Markdown plans.

Humans read a short, scenario-driven `MASTER_PLAN.md`. AI agents read compressed symbolic `.ai.md` part files one at a time. This keeps plans progressive, reduces context rot, and makes completion evidence-based.

The compressed AI format is called **PlannablePlan**.

```txt
@PlannablePlan v0.1
```

## Why Plannable?

- SpecKit-style product scenarios
- Predictable outcomes for each phase and part
- Progressive context loading for agents
- Compressed AI-readable execution files
- Evidence-based checkoff before completion

Long Markdown plans are easy for agents to skim badly, over-load into context, or treat as a vague TODO list. Plannable separates human orientation from agent execution: `MASTER_PLAN.md` stays short, while each `plans/PART*_PLAN.ai.md` file carries one compact scenario slice with tasks, acceptance criteria, verification, completion updates, and stop conditions.

Unlike generic planning tools, Plannable is intentionally command-driven and evidence-based. It does not manage a hosted project board or call an AI API. It creates files that coding agents can read progressively and verify locally.

## How Plannable Compares to SpecKit-Style Flows

SpecKit produces long human-readable spec, plan, and task documents that an agent must load wholesale. Plannable keeps the human document short and pushes execution detail into compressed per-part files:

- Each part file carries a `CTX:` block with the product goal, what prior parts delivered, and what comes next — so loading **one** part gives an agent the whole masterplan arc without loading the others.
- `MASTER_PLAN.md` checkboxes and `PLAN_EVIDENCE.md` are the source of truth; `PLAN_STATE.md` is generated from them, so plan state cannot silently drift.
- Completion is gated on recorded evidence (`plannable complete` refuses without it), and `plannable verify` structurally checks the whole plan — including warning when a plan still contains generic draft wording that hasn't been enriched for the actual product.

## Quick Start

```bash
npm install
npm run build
npm run start -- create "CRM"
npm run start -- run-next
npm run start -- status
npm run start -- verify
```

When published or linked globally:

```bash
plannable create "CRM"
plannable create "inventory management app"
plannable create "SaaS billing dashboard"
plannable create "mobile habit tracker"
plannable create "backend API"
plannable run-next
plannable status
plannable verify
```

`CRM`, `TODO app`, `restaurant homepage`, `SaaS billing dashboard`, `mobile app`, and `API/backend` ideas use scenario hints: small domain-specific nudges that make common examples sharper. Plannable is not limited to them; `create` accepts any software product or implementation plan name and generates a three-part scenario plan.

Scenario hints are not templates. They do not limit what Plannable can plan; they only improve the first draft when the product idea matches a familiar software domain.

## Platform Command Styles

Terminal CLI:

```txt
plannable create "CRM"
plannable create "TODO app"
plannable run-next
plannable status
plannable verify
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

Terminal uses the real executable command: `plannable`. Codex uses skill mention style: `$plannable`. Claude Code can invoke skills directly with `/plannable`. Cursor supports Plannable through Agent Skills and optional slash-command wrappers.

The workflow stays the same everywhere, even if launcher syntax differs.

## Generated Project

```txt
MASTER_PLAN.md
PLAN_STATE.md
PLAN_EVIDENCE.md
plans/
  PART1_PLAN.ai.md
  PART2_PLAN.ai.md
  PART3_PLAN.ai.md
```

`MASTER_PLAN.md` is for humans. `plans/PART*_PLAN.ai.md` files are for agents. Agents should load only the next pending part — its `CTX:` block summarizes everything delivered before it and what comes next.

`PLAN_STATE.md` is generated from `MASTER_PLAN.md` and `PLAN_EVIDENCE.md` by `plannable evidence`, `plannable complete`, and `plannable repair`. Do not hand-edit it; run `plannable repair` if it drifts.

## Folder Structure

```txt
src/                    TypeScript CLI source
templates/              Generated plan templates
docs/                   Install, command, workflow, spec, and platform docs
examples/               Example Plannable projects
.agents/skills/         Codex skill instructions
.claude/skills/         Claude Code skill instructions
.cursor/                Cursor skill, commands, and rules
```

## Commands

- `plannable create "CRM"` creates a scenario-driven plan.
- `plannable create "inventory management app"` creates a scenario-driven plan for an arbitrary software idea.
- `plannable run-next` prints the next pending compressed part.
- `plannable status` summarizes completion and evidence.
- `plannable verify` checks required files, headers, and completion evidence.
- `plannable evidence PART-001 "summary"` records evidence for a part.
- `plannable complete PART-001` checks off a part after evidence exists.
- `plannable doctor` prints status and verification together.
- `plannable repair` fixes common plan/state drift.
- Add `--json` to `run-next`, `status`, `verify`, or `doctor` for machine-readable output.
- `plannable compress plan.md` converts a Markdown-ish task file into `plan.ai.md` and reports estimated token savings.
- `plannable expand plans/PART1_PLAN.ai.md` expands a compressed part into a human summary.

See [docs/COMMANDS.md](docs/COMMANDS.md) for details.

## Advanced Init

`plannable init` creates blank Plannable files in an existing project. It is not required before `create`, and it is not part of the normal workflow.

Use `create` when you want generated scenarios:

```bash
plannable create "restaurant homepage"
plannable create "SaaS billing dashboard"
```

## PlannablePlan Example

```txt
@PlannablePlan v0.1
ID=PART-001
PH=CORE
SCN=SCN-001
OUT=Contact management works

CTX:
- product: CRM — managing contacts, companies, deals, tasks, and follow-ups
- phase: Core CRM Foundation (part 1/3)
- prior: none — this is the first part
- next: PART-002 covers "Deal pipeline works"

T:
1 create:contact.entity(fields=name,email,phone,company,notes)
2 create:contact.form

AC:
- can create contact
- required fields validated

V:
- npm run typecheck?
- npm test?

DONE:
- update MASTER_PLAN.md Part 1=[x]
- append PLAN_EVIDENCE.md#PART-001 with files+checks+notes

S:
- if database stack unclear, stop and ask
```

## Example Workflow

```bash
plannable create "CRM"
plannable run-next
# Agent implements only the printed part.
plannable evidence PART-001 "Implemented and verified contact creation." --artifact "npm test"
plannable complete PART-001
plannable status
plannable verify
plannable doctor --json
```

## Roadmap

- Improve Markdown-to-PlannablePlan compression.
- Add richer structural verification and repair suggestions.
- Improve scenario hints for more software planning domains.
- Add richer repair suggestions for uncommon plan drift.
- Package and publish the CLI for npm installation.

See [docs/V1_ROADMAP.md](docs/V1_ROADMAP.md) for the v1 path and [docs/V1_AUDIT.md](docs/V1_AUDIT.md) for the current audit.
# plannable
