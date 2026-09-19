# PlannablePlan Spec

PlannablePlan is the compressed AI-readable execution format used by Plannable.

Do not call it PlanPack.

## Stability and Versioning

The `@PlannablePlan v0.1` format is **stable**. The header version only changes on breaking changes (removing or renaming a required field or block, or changing how an existing block is parsed). Additive changes — new optional blocks like `CTX:` — do not bump the version, and parsers must ignore unknown blocks.

Parsers are tolerant of hand-written plans: CRLF line endings, extra blank lines, and spaces around field `=` signs (`ID = PART-001`) all parse identically to generated output.

## Header

Every `.ai.md` part file must start with:

```txt
@PlannablePlan v0.1
```

## Required Fields

```txt
ID=PART-001
PH=CORE
SCN=SCN-001
OUT=Contact management works
```

## Required Blocks

```txt
T:
1 create:contact.entity(fields=name,email,phone,company,notes)

AC:
- can create contact

V:
- npm run typecheck?

DONE:
- update MASTER_PLAN.md Part 1=[x]
- append PLAN_EVIDENCE.md#PART-001 with files+checks+notes

S:
- if database stack unclear, stop and ask
```

## Context Block (Strongly Recommended)

`CTX:` carries compressed phase context so an agent loading only this part still understands the whole masterplan arc. `plannable create` and `plannable compress` emit it, and `plannable verify` warns when it is missing.

```txt
CTX:
- product: CRM — managing contacts, companies, deals, tasks, and follow-ups
- phase: Core CRM Foundation (part 2/3)
- prior: PART-001: Contact management works
- next: PART-003 covers "Follow-up tasks work"
```

Agents should also append detected stack and conventions to `CTX` while enriching the draft (for example `- stack: Next.js 15 + Prisma + Postgres`).

## Imported Code

Fenced Markdown code is stored as a single semantically readable item, for example `- code[bash]: "npm test\n npm run build"`. The value is a JSON string so newlines, quotes, and indentation survive without becoming plan block delimiters. `expand` restores a fenced block. This is optional content inside existing blocks; the v0.1 structure is unchanged.

## Optional Blocks

```txt
DICT:
C:
F:
DEP:
RISK:
NOTE:
```

## Loading Rule

Agents should load only the next pending `.ai.md` part. The human-facing `MASTER_PLAN.md` provides orientation, not implementation detail.

## Anti-Patterns

- Giant Markdown paragraphs
- Binary, base64, gzip, or punctuation-only compression
- Loading all part files at once
- Checking off work without evidence
- Calling the format PlanPack

## Optional guidance tags

Existing blocks can carry expected rule IDs/revisions in CTX and matching `[rule.id]` lines in C/T/AC/V. [GUIDANCE.md](GUIDANCE.md) defines the marker syntax and limits. Missing mappings produce warnings only; v0.1 plans without markers keep their existing behavior. Constraints survive expansion and supported Markdown import.
