# Acceptance matrix

These are future tests and review criteria, not executed feature results. Run in isolated consumer projects with existing installation safeguards. Capture current main-branch behavior before implementation.

| Fixture or check | Required result |
| --- | --- |
| Owner never mentions security | Applicable baseline safeguards still appear; no questions asking whether secrets/input/permissions should be protected |
| Owner answers “not sure” | Agent investigates technical facts, recommends a reversible assumption and pauses only unresolved risky work; no invented permission for exposure/cost/deletion |
| Static public brochure, no forms/accounts/data store | Relevant baseline/UI quality only; no invented login, database, payments or mandatory backup service |
| Local single-user CLI | Relevant local path/input/data safety; no browser/session requirements |
| Confirmed private multi-business CRM | Plan contains direct cross-business denial and legitimate-success checks without the owner requesting security; actual outcomes require executing those tests in the behavioral evaluation |
| External payment webhooks | Provider choice remains explicit; signature/duplicate-delivery cases planned from verified provider docs; no invented provider/API |
| “Build a customer app,” no architecture yet | Unknown roles/exposure recorded; meaningful questions; no claim dependencies prove protections |
| Explicit “no accounts/no payments” request | No feature additions from scenario hints or modules; contradictory constraints surface as decisions |
| Existing conventions, custom scripts and unsupported stack | Reuse verified checks; mark unavailable checks; no invented commands, global execution or framework guarantee |
| Existing v0.1 plan without guidance | Commands/options, JSON contracts, exit codes and completion/evidence semantics preserved |
| Compress/expand/recompress | Security constraints in C, rule IDs, applicability, tasks, AC/V and stops remain semantically visible; reproduce current C-block loss, fix it and add a regression; no general lossless Markdown claim |
| Active scope changes from brochure to form/private data | Agent adds relevant input/data/access requirements in the active part before coding; does not skip part order or reload all parts |
| Known rule omitted, only happy path tested, or evidence says unavailable | Coverage diagnostics/agent review expose omission; unavailable or merely planned checks never reported as passed |
| Small behavioral fixture with a deliberately disabled protection | Planned negative test fails with the protection disabled and passes after restoring it; legitimate operation still succeeds |
| Missing/stale/conflicting module metadata | Clear advisory or build-time library error; no silent dropped requirement, execution of rule content, or old-plan migration |
| Installed CLI plus copied platform skills | References resolve outside checkout; spaces/custom config scopes work; source can move for packed installs |
| Skill instructions | Same selection semantics and maintained platform syntax; real discovery distinguished from simulated fixtures |

## Measure before claiming improvement

- Compare the same tasks in three conditions: ordinary agent planning, current Plannable at recorded revision, and enhanced Plannable. Hold model/version, project, prompt, tools and evaluation allowance constant; record repeated runs and review outputs with condition labels hidden where practical. Predefine expected controls and forbidden feature additions. “Has security words” is not a pass condition.
- Measure critical omissions, unnecessary features/questions, failed behavior checks, rework, session-resumption mistakes and full context usage. Release target for the fixed fixture set: zero omitted predefined essential controls and zero added forbidden features; report failures rather than extrapolating to all apps.
- Exercise at least three small isolated behavioral cases (ownership denial, injection-safe data handling, local-file preservation), reusing disposable fixtures. A negative test must fail after intentionally disabling its control. This demonstrates test sensitivity; it does not prove every generated application safe.
- Each selected requirement maps to actions, acceptance and verification; remove vague “follow best practices” placeholders. Cross-feature requirements appear wherever needed.
- Small moderated pilot: five non-technical participants, each explains a protection decision, answers “not sure,” identifies the next action and distinguishes planned safeguards from passed checks without security jargon. Measure unnecessary technical questions and whether participants had to request basic protection. Proposed initial target: at least four succeed unaided. Report sample size and failures; this is not proof of broad usability.
- Run a fixed agent prompt set for selection and unsupported claims separately from deterministic unit tests. Record model/version/input, repeated-run variance and human review; do not claim model accuracy from unit tests.
- Report actual tokenizer counts where tooling exists, otherwise label the length/4 estimate. Count master orientation + active part + skill + loaded references. Proposed initial review threshold: +250 estimated tokens per ordinary part; exceeding it needs a documented reason, never deletion of a necessary safeguard. Establish complex-case budgets from fixtures.

## Release verification

1. `npm run check` and existing cross-platform Node matrix; include module files in formatting/lint/package checks as appropriate.
2. `npm --prefix site run lint` and `npm --prefix site test`; extend rendered-route tests for exact metadata/canonicals, visible answers and new links.
3. Real global/local package installs and guidance reads, repeated installs, custom paths and safe uninstall. Keep zero runtime dependencies and the package-size check.
4. After an authorized release: test exact published Git/package artifacts, fresh platform discovery, and unauthenticated production HTML/crawler routes. Local rendered HTML is not live indexing evidence.
5. Record executed tests, unavailable environments, residual decisions and source versions before checking off a part. Preserve root launch-plan status separately.
