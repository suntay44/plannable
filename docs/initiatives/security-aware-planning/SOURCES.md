# Research and repository basis

Reviewed 2026-09-17. These inform the proposal; they do not establish certification or feature completion. Recheck versions and relevant sections before implementation.

| Primary source | Use in this proposal |
| --- | --- |
| [OWASP Threat Modeling Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Threat_Modeling_Cheat_Sheet.html) | Identify the system, plausible failures, mitigations and validation during ordinary design work |
| [OWASP ASVS repository](https://github.com/OWASP/ASVS) | Reviewed web security requirements; identifies 5.0.0 as latest stable and recommends versioned references. Do not infer all-platform coverage or copy the standard into plans. |
| [NIST SSDF 1.1, SP 800-218 final](https://csrc.nist.gov/pubs/sp/800/218/final) | Integrate risk-based security practices into the existing lifecycle |
| [OWASP Authorization Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) | Trusted-boundary ownership/permission checks for the worked example |
| [OWASP Secrets Management](https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html) | Agent-owned secret handling rather than asking users whether secrets matter |
| [OWASP Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html) and [SQL Injection Prevention](https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html) | Boundary checks plus safe query APIs; validation alone is not injection protection |
| [W3C WCAG 2.2 quick reference](https://www.w3.org/WAI/WCAG22/quickref/) | Source for applicable UI accessibility requirements; selected checks do not imply full conformance |
| [Google AI features and your website](https://developers.google.com/search/docs/appearance/ai-features) | Ordinary SEO foundations, helpful indexable content, no special AI markup; indexing is not guaranteed |
| [Google structured-data policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies) | Metadata describes visible, truthful page content |

## Observed implementation seams

Paths below are relative to the repository root, three levels above this directory.

- `src/commands/create.ts` composes a deterministic model and detected context; `src/core/project-context.ts` detects directories/common scripts, not security guarantees.
- `src/core/scenario-hints/` supplies domain drafts. Keep security applicability independent from domain keywords.
- `templates/PART_PLAN.ai.md` supplies `CTX/C/T/AC/V/S`; no new required block or command is needed.
- `src/core/plannable-plan.ts` currently omits `C` from expanded output; review reproduced the loss with a unique ownership constraint. `markdown-import.ts` maps constraint headings into context. Preservation is now an explicit Part 2 requirement.
- `src/commands/verify.ts` checks structure/state/evidence; `src/core/evidence.ts` accepts artifact text. Neither executes or attests to application security tests.
- Four platform skill copies have an “Enrich the Draft” step. Integrate there and test mirrored references, not a new onboarding flow.
- Site layout/page/crawler routes and `site/tests/rendered-html.test.mjs` provide SEO foundations. Root CI checks the CLI; site checks must also run for this initiative.
- Root `MASTER_PLAN.md` has discovery pending. Coordinate live-access verification without prematurely completing that part.

Planning-session validation: existing `repair` regenerated this initiative's state; `verify` passed 44 checks without warnings; `status --json` reported three pending parts and zero completed/evidenced parts. This validates the plan artifact only. No application security audit, participant study, feature implementation, or search-ranking experiment was performed.

Second-review validation: reran those checks after revising defaults and all three parts. Separately checked each part's outcome/scenario against the master, dependency order, pending status, local document links and whitespace; all passed. The in-memory C-block expansion reproduction failed to retain its constraint, as recorded in REVIEW.md; fixing that runtime behavior remains Part 2 work.
