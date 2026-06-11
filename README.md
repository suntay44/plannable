# Plannable

Command-driven planning for AI coding agents.

Plannable turns a product idea into a short, human-readable `MASTER_PLAN.md` plus compressed, agent-readable part files (**PlannablePlan** `.ai.md` format). Agents load one part at a time — each part carries enough context about the whole masterplan to work alone — and nothing gets checked off without recorded evidence.

Think [spec-kit](https://github.com/github/spec-kit), but the plan is split into compressed parts where each part knows its place in the masterplan.

## Use Cases

- **Greenfield projects** — turn a product idea into a phased, scenario-driven plan in seconds
- **AI-assisted development** — agents implement one part at a time without losing the big picture
- **Multi-phase features** — break a complex feature into ordered parts with explicit hand-off context
- **Audit trails** — every completed part has recorded evidence before it can be checked off
- **Solo or team** — humans read `MASTER_PLAN.md`; agents read one `.ai.md` part at a time

## Install

> Requires Node.js 18+

```bash
npm install -g plannable
plannable --version
```

Before npm publish, install from source:

```bash
git clone https://github.com/suntay44/Plannable.git
cd Plannable && npm install && npm run build && npm link
```

You can also ask your agent:

```txt
Look at this GitHub repo and install Plannable:
https://github.com/suntay44/Plannable
```

See [docs/INSTALL.md](docs/INSTALL.md) for CLI, Codex Desktop, Claude Code, and Cursor install steps.

## Get Started

```bash
plannable create "CRM"     # generate MASTER_PLAN.md + compressed part files
plannable run-next         # print the next pending part (load only this)
# ...implement the part...
plannable evidence PART-001 "Contact creation works" --artifact "npm test"
plannable complete PART-001
plannable verify           # structural + evidence checks for the whole plan
```

`create` accepts any product idea (`"SaaS billing dashboard"`, `"mobile habit tracker"`, `"backend API"`, ...). Common domains get sharper first drafts via scenario hints; everything else gets a generic draft that `verify` will warn you to enrich with product-specific detail before implementing.

## Generated Files

```txt
MASTER_PLAN.md          short, scenario-driven plan for humans (source of truth)
PLAN_EVIDENCE.md        evidence log — proof a part is actually done (source of truth)
PLAN_STATE.md           progress view, generated from the two files above
plans/PART*_PLAN.ai.md  compressed parts for agents, loaded one at a time
```

Each part file carries a `CTX:` block — the product goal, what prior parts delivered, and what comes next — so one part file is all the context an agent needs:

```txt
@PlannablePlan v0.1

ID=PART-002
PH=CORE
SCN=SCN-002
OUT=Deal pipeline works

CTX:
- product: CRM — managing contacts, companies, deals, tasks, and follow-ups
- phase: Core CRM Foundation (part 2/3)
- prior: PART-001 delivered "Contact management works"
- next: PART-003 covers "Follow-up tasks work"

T:
1 create:deal.entity(fields=title,company,value,stage)
2 build:pipeline.stages

AC:
- a deal can move through pipeline stages

V:
- npm test?

DONE:
- update MASTER_PLAN.md Part 2=[x]
- append PLAN_EVIDENCE.md#PART-002 with files+checks+notes

S:
- if database stack unclear, stop and ask
```

Full format reference: [docs/PLANNABLE_PLAN_SPEC.md](docs/PLANNABLE_PLAN_SPEC.md).

## Commands

| Command | What it does |
| --- | --- |
| `plannable create "CRM"` | Generate a scenario-driven plan for any product idea |
| `plannable run-next` | Print the next pending part (the only file an agent should load) |
| `plannable status` | Show progress, grouped by masterplan phase |
| `plannable evidence PART-001 "summary" --artifact "npm test"` | Record proof of completed work |
| `plannable complete PART-001` | Check off a part — refuses without evidence |
| `plannable verify` | Validate files, structure, evidence; warn on generic draft wording |
| `plannable doctor` | Status + verification in one report |
| `plannable repair` | Regenerate `PLAN_STATE.md` and fix drift after manual edits |
| `plannable compress plan.md` | Convert a Markdown plan into `plan.ai.md`, reporting token savings |
| `plannable expand plans/PART1_PLAN.ai.md` | Expand a compressed part back into readable Markdown |

Add `--json` to `run-next`, `status`, `verify`, `doctor`, or `repair` for machine-readable output. Details: [docs/COMMANDS.md](docs/COMMANDS.md).

## Using Plannable from an AI Agent

Plannable ships skill instructions for three platforms — copy or reference the matching folder:

| Platform | Skill location | Invocation |
| --- | --- | --- |
| Claude Code | `.claude/skills/plannable/` | `/plannable create a CRM` |
| Codex | `.agents/skills/plannable/` (official discovery path; `.codex/skills/` ships as a mirror) | `$plannable create a CRM` |
| Cursor | `.cursor/skills/plannable/` (+ `.cursor/commands/`, `.cursor/rules/`) | `/plannable create a CRM` |

Plannable is a **skill** (the open [Agent Skills](https://agentskills.io) `SKILL.md` standard), not a plugin. Codex officially discovers repo skills from `.agents/skills/`; the `.codex/skills/` copy exists for setups that scan that path instead.

The workflow is the same everywhere: create → enrich the draft with product-specific detail → run-next → implement → evidence → complete → verify.

## Rules That Keep Plans Honest

- **One part at a time.** Agents load only the next pending `.ai.md` file; its `CTX:` block supplies the masterplan arc.
- **Evidence before checkoff.** `complete` fails unless evidence is recorded in `PLAN_EVIDENCE.md`.
- **No state drift.** `MASTER_PLAN.md` + `PLAN_EVIDENCE.md` are the source of truth; `PLAN_STATE.md` is generated from them — never hand-edit it, just run `plannable repair`.
- **Drafts must be enriched.** `verify` warns while the plan still contains generic scaffold wording.

## More

- [docs/WORKFLOWS.md](docs/WORKFLOWS.md) — end-to-end workflows
- [docs/README_CLAIMS_AUDIT.md](docs/README_CLAIMS_AUDIT.md) — README claim-by-claim implementation check
- [docs/COMPLETION_RULES.md](docs/COMPLETION_RULES.md) — what "done" requires
- [docs/PLATFORM_SUPPORT.md](docs/PLATFORM_SUPPORT.md) — platform specifics
- [examples/](examples/) — generated example projects (CRM, TODO app, restaurant homepage)
- [docs/V1_ROADMAP.md](docs/V1_ROADMAP.md) — path to v1

MIT licensed.
