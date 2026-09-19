# Routine safeguards: agent responsibility

Proposed requirements for the first release, not implemented protections. The owner describes the product; the agent selects, implements and checks applicable safeguards. Never ask whether secrets should be protected, inputs checked, or permissions enforced. Ask about intended access, sharing, retention, costs and deployment exposure only when facts are missing.

## Decide without a security questionnaire

| Situation | Agent action |
| --- | --- |
| Established technical safeguard fits confirmed scope | Include it by default; reuse the project's supported mechanism; explain briefly without requesting a technical decision |
| Implementation fact is unknown | Inspect targeted source/config/docs first; absence in a manifest does not prove absence in infrastructure |
| Product choice changes who can see/lose data or spend money | Ask one concrete question with a recommended choice, consequence and “not sure” path |
| Owner is unsure or unavailable | Record the uncertainty and a reversible proposed default; do not treat silence as approval for exposure, data deletion, cost or a new product feature |
| Risky feature cannot be implemented safely with available facts | Keep its implementation pending under `S`; continue independent tasks within the active part; do not skip the existing part order |
| Explicit request conflicts with protection | Explain the consequence and record the decision; do not silently weaken a control or override the user's product intent |

These are planning rules, not a new approval flow. Routine work within confirmed scope continues. Proposed defaults do not retroactively restrict existing public functionality; material compatibility/security conflicts must be resolved before changing it.

## Minimum coverage to author and test

Rules below are concise requirements to specialize, not snippets to inject into every part. Each needs a stable ID, module owner, source and applicability fixture. Preserve the six modules in DESIGN.md; split internal data files when needed rather than adding user-facing modes.

| Module and trigger | Agent-owned default | Required failure/success evidence example |
| --- | --- | --- |
| Baseline: every project | Never place real secrets in plans, source, browser bundles or logs; use placeholders and supported secret configuration; preserve existing protections | A fake secret marker stays out of generated plans/logs/bundles where those outputs exist; normal config still works |
| Baseline: dependencies/configuration changed | Use supported project conventions; review dependency origin/advisories and changes; keep dev/production configuration distinct; no forced broad upgrades | Lock/config diff and relevant check results; record unresolved advisories instead of claiming a clean security bill |
| Access: login or private operations | Reuse maintained authentication/session mechanisms; enforce intended permissions at the trusted boundary on each operation, with least privilege and denial for unspecified private access | Logged-out and wrong-owner direct requests denied; permitted user succeeds; guessed IDs do not bypass checks |
| Access: browser sessions | Plan session protection and CSRF defenses where applicable to the chosen authentication design; do not invent custom crypto or assume hiding a button protects an operation | Session/unauthorized-action cases for the actual stack, while legitimate sign-in and intended public pages still work |
| Input boundaries: external data enters queries, commands or HTML | Validate type/length/shape at trusted boundaries; use parameterized/safe APIs and context-appropriate output handling; validation alone is not injection protection | Malformed input rejected; SQL/command/HTML payload remains data or is rejected; legitimate input still works |
| Input boundaries: upload, filesystem path or outbound URL | Constrain supported types/sizes, destination/path and access as applicable; handle traversal and unexpected network targets | Traversal/oversized/unapproved destination fixture denied without unrelated file changes; permitted operation succeeds |
| Data: stored/private data or destructive operations | Minimize collected fields; redact sensitive errors/logs; specify retention and safe migration/recovery needs without inventing a retention period or running deletion | Sensitive values absent from relevant errors; failed change preserves data; recovery method checked in a disposable fixture |
| External services: network integration/payment/public costly action | Keep credentials on trusted side; verify webhook authenticity, use appropriate retries/idempotency and bound resource use; verify production transport/config with provider docs | Forged/duplicate event or repeated costly request handled as designed; legitimate event succeeds without duplicated effects |
| Quality: all changes, specialized to affected behavior | Reuse clear local conventions; cover failure paths, actionable errors and tests; maintain UI accessibility and recovery where relevant | Failed operations are understandable; normal path works; applicable keyboard/form-error checks pass |

Use [OWASP authorization](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html), [secrets management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html), [input validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html), and [SQL injection prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) as reviewed foundations. Remaining specialized rules require their relevant framework/provider sources during Part 1 authoring; the table is not a complete security standard or a completed mapping.

## Compact handoff inside existing files

- Use stable text tags inside existing blocks, for example `C: - [access.owner] ...`, corresponding `T/AC/V` lines, and module revision/applicability in `CTX`. Define the exact tag grammar and diagnostics in Part 1; do not create new required blocks or commands.
- Record ordinary technical defaults separately from owner decisions and unresolved facts. A module reference is not evidence that its requirements were implemented.
- Before coding, the agent checks the active part's applicable rule IDs against its constraints, tasks, acceptance and intended verification; add missing requirements during existing enrichment. Avoid silently treating a missing rule as “not applicable.”
- When scope changes during an active part (for example, a static site gains a form), reassess applicability and update that part before coding the new boundary. Record implications for later parts in the master without reading all part files.
- Record verification in existing evidence text: `requirement ID; changed path; command/manual check; observed result; artifact; limits`. A planned check, implementation edit, unavailable check and observed passing result are distinct. Never request private production data as evidence.
- Explain results to the owner in a few sentences: safeguards planned; checks actually passed; anything still unresolved. No security score, green badge or implication that `complete` attests to correctness.

Privacy/regulated/high-consequence requirements and unsupported technologies need explicit specialist/context review where applicable. This does not prevent routine planning work, and is not a blanket requirement for every project.
