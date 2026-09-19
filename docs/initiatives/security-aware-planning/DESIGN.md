# Design: strengthen the existing planning phase

Proposed, not implemented. Keep `create → enrich → run-next → evidence → complete → verify`, existing options/exit behavior, three generated parts, and PlannablePlan v0.1. No new wizard, mandatory security phase, hosted service, scanner, or runtime dependency.

## Routine protection without technical decisions

During existing draft enrichment, the agent takes responsibility for the applicable defaults in [DEFAULTS.md](DEFAULTS.md). Inspect known context before asking. Never ask owners to choose whether routine protections should exist or to select cryptographic/session mechanisms. Ask only product choices whose consequences cannot be safely inferred; offer a recommendation and “not sure.” Aim for one necessary question per exchange, at most three related questions:

| Plain-language question | What the agent records |
| --- | --- |
| Who should be able to see or change this information? | Roles, ownership boundaries, public versus private actions |
| Will you store customer, financial, health or other private information? | Data categories, not a demand that the owner identify technical threats; inspect already-known fields first |
| Will this be public, connect to other services, accept files, or handle payments? | Exposure and integration boundaries; follow up only on selected features |

Do not request real credentials or customer records. Summarize automatic defaults, owner decisions and open questions separately in a few master-plan bullets. If the owner is unsure, propose a reversible assumption; do not silently approve exposure, deletion, cost or scope additions. Unresolved high-impact questions pause affected work under existing stop conditions; independent tasks in the active part can continue without skipping part order.

CLI-only users receive a deterministic draft with visible open questions and examples. The CLI does not pretend to conduct a conversation or infer a threat model. Agent-led enrichment turns that draft into specific requirements.

## Small reusable guidance modules

Proposed files: `src/core/guidance/{types,select,render}.ts` and `templates/guidance/` data files. These paths are design choices, not existing features. Keep project observation in `project-context.ts`, domain scenarios in `scenario-hints/`, and guidance composition separate. No new config file is required in users' projects.

Each module has stable requirement IDs, a revision, applies/does-not-apply conditions, decision class (technical default, inspect first, or owner choice), plain-language reason, constraints, task hints, acceptance/failure cases, verification suggestions, stop conditions, and source URLs/version/review date. Define text tags shared by CTX/C/T/AC/V so deterministic diagnostics can match requirements without pretending to understand prose. A module is data, never executable code or an auto-run shell command.

| Initial module | Applicable guidance, tailored to the part |
| --- | --- |
| Baseline | Keep secrets out of source/plans/logs; preserve existing protections and user data; make trust assumptions explicit |
| Access | When accounts/private actions are confirmed: trusted-side ownership/role checks, including denied requests |
| Data | When persisted/sensitive data is confirmed: collect only needed data, define retention/deletion and recovery expectations |
| Input boundaries | When input/files/URLs cross a boundary: validate there, use safe APIs, constrain size/path/destination as applicable |
| External services | When integrations are confirmed: protect credentials, verify incoming messages, handle retries and failures; provider details require verified documentation |
| Quality | Reuse project conventions; test changed behavior; handle failures; add accessibility for UI and recoverability for data-changing operations |

This is bounded initial coverage, not all-platform security support. Framework/provider-specific guidance is an extension after versions and official sources are verified; Next.js dependencies do not prove a Vinext deployment has identical behavior. Local tools and static sites must not acquire accounts, payments, or a server because another module mentions them.

## Selection and composition contract

1. Observe relevant manifests, existing conventions, and explicit user context. Record provenance: `confirmed`, `inferred`, or `unknown`; package presence alone is only a signal.
2. Include baseline and relevant quality defaults automatically; include conditional guidance for confirmed features without asking permission for standard safeguards. Inferred context prompts targeted inspection, then an owner question only for unresolved product intent. Unknown applicability is recorded, not silently omitted or treated as confirmed. Explicit exclusions remain visible.
3. CLI selection uses only facts it can substantiate without executing the project or parsing arbitrary intent as certainty. The agent applies additional modules during existing enrichment using bundled guidance, without a new command or option.
4. Render actionable requirements into existing `CTX`, `C`, `T`, `AC`, `V`, and `S`. Deduplicate by stable requirement ID; each affected part carries its necessary details. Never require loading other part files or the whole library to understand a rule.
5. Project decisions can specialize guidance. Conflicting security implications become an explicit decision with rationale and residual risk; never silently replace a convention, invent a bypass, or assume approval.
6. On scope changes during enrichment/execution, reassess relevant rules in the active part and record later-part implications in the master. Keep the current execution order. Record module revisions in context. Updating Plannable must not rewrite existing plans. No network refresh, remote rule loading, recursive project scan, or third-party executable packs in the first release.

Part 1 also defines a pre-coding coverage review in the existing enrichment step: applicable rule → constraint/action → failure/success criterion → intended check. The CLI can check explicit tags but cannot know every applicable risk from prose. Do not turn this review into a new command or phase.

CLI assets live in the installed package. Standalone skills need a compact relative `references/` guide generated from the same canonical module data, limited to selection and enrichment examples. Keep four platform copies synchronized with a check; verify copied skills and packed CLI resources outside the checkout. Do not embed maintainer-local skill paths.

## Worked example: private customer records

Owner says: “Each business should only see its own customers.” Assuming accounts and multiple businesses are confirmed, the agent enriches the affected part:

```text
CTX:
- access@1: private records; business membership confirmed by owner
C:
- Enforce business ownership at the trusted data boundary on every read/write.
T:
1 Reuse existing session and membership checks for customer operations.
AC:
- Business A cannot read or change B's customer even with a guessed record ID.
- A member can still perform permitted actions on their own customers.
V:
- Run the project's identified access tests; cover direct requests and denied writes.
S:
- Resolve unknown membership rules before implementing customer access.
```

For a public static brochure with no private records, omit this module. For unknown ownership, ask rather than assume all records are private. This example follows [OWASP authorization guidance](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html).

## Preserve safeguards through existing conversions

The current `expandPlannablePlan` omits `C`, and the Markdown importer treats constraint headings as context. A valid plan with a unique ownership constraint lost that sentence on expansion in the review reproduction. Part 2 must preserve security constraints and rule traceability through supported compress/expand paths before this guidance is advertised. Keep command names/format compatibility; do not claim general lossless Markdown support.

## Honest verification and evidence

`verify` continues to check plan structure/state/evidence, not application security. Add only advisory, deterministic guidance diagnostics when a new module marker is present: missing applicability reason, unresolved decision, or missing mapped acceptance/check. Old plans remain valid, with unchanged exit codes and no retroactive mandatory security requirements.

The agent records requirement ID, changed path, actual command/manual check, observed result, artifact and limits using existing evidence fields. Capture output/artifact references where available rather than only asserting “passed.” Test failure must remain visible; an unavailable check is never labelled passed. This improves reviewability, not cryptographic attestation. Manual checks, unavailable checks, and unresolved risks remain distinct in text. `complete` still verifies evidence presence; neither a successful command nor a note proves a control works. Do not add a “secure” badge or a stricter hidden completion gate.

Planning readiness: each applicable requirement needs a reason, action, observable outcome, and intended verification; routine safeguards cannot be dropped just because the owner did not ask for them; unresolved high-impact decisions need an owner question and stop condition. Development review needs actual results and residual risks. Neither criterion certifies security.

## Open-source maintenance

Add a contribution recipe: applicability plus non-applicability fixtures, sources, failure example, review date, and maintainer review. Use versioned ASVS references only where a reviewed mapping exists; write original concise guidance and check attribution/license requirements before importing source text. Recheck guidance on upstream changes and before releases; deprecate stale rules visibly. Keep stack adapters and custom policy languages for later, after this contract proves useful.
