# Implementation validation — 2026-09-17

Environment: macOS, Node 22.22.3; baseline revision `393ab96`. No account settings, actual installed skills or global packages were changed. All consumer installation fixtures use temporary configurations.

## Part 1: modular defaults

- Baseline quality gate: 59 tests passed before implementation.
- Developed six data modules with 13 rules, validated schema/provenance and deterministic fact-based selection.
- Focused selection/library tests: 9 passed. Every conditional rule has confirmed, excluded, inferred and unknown cases; routine defaults remain on when all optional features are absent.
- Full quality gate: 68 tests passed; formatting, lint, types, build and package check passed (346,073 bytes at that check).
- Reviewed primary sources for authorization, sessions, secrets, validation/injection, file/URL boundaries, dependencies, privacy, database recovery, logging, REST/resource limits, accessibility and SSDF. Wording is original; no certification or provider-specific implementation claim.
- Validation limit: these tests validate guidance selection/data, not model execution or a generated application's security.

## Outstanding external validation

Non-technical participant pilot and controlled repeated-model comparison are not yet executed. No public release, Windows/Linux CI run, or production publishing is implied by local checks.

## Part 2: local develop/test/validate

- Integrated baseline defaults into create, declaration-based dependency review, marker-scoped advisory mapping checks, generated relative skill references, and C-block preservation in expand/import.
- Full quality gate passed: 76 tests, formatting, lint, types, build and package check; package 346,381 bytes at that check, below the existing 400 KB ceiling. Development-only initiative notes are excluded from the distributable.
- Real offline tarball installs passed globally and project-locally, then created/verified plans after moving the source; all four copied skill reference trees resolved in custom paths with spaces.
- Three disposable control demonstrations passed: cross-owner denial detects disabled authorization; bound SQLite queries reject injection while the deliberately vulnerable query fails the check; filesystem containment preserves a neighboring fixture file and detects removal of protection. These are illustrative controls, not agent-generated application evidence.
- Reproduced C-block loss is fixed: expansion and recompression retain the ownership constraint and rule mappings. Tests remove verification/basis entries to ensure warnings appear; legacy plans keep existing validation behavior.
- Fixed deterministic CRM sample: first part 305 → 513 estimated tokens (+208). Master + part + skill: 1,467 before; with new master/part/skill and the guidance index plus baseline/quality references loaded: 2,999. This length/4 estimate includes extra context, is not a tokenizer result, and is not a model outcome comparison.
- Two old assertions changed intentionally: Markdown constraints now import into C, and generated V includes guidance checks alongside actual project commands. Original checks remain asserted.
- Human pilot and repeated-model comparison unavailable in this session. Part 2 stays pending for those acceptance criteria; local validation is sufficient to prepare independent Part 3 content without publishing outcome claims.

## Part 3 and final review

- Added two substantive pages, homepage/FAQ/getting-started explanations, navigation and crawler links. Unreleased capabilities and untested outcome claims are explicitly distinguished.
- Reproduced a canonical/crawler-origin mismatch against the previous site build; all routes now share the configured origin. Regression test passed after the fix.
- Site lint, production build and 11 rendered tests passed. Actual in-app browser review at desktop width and 390 × 844 confirmed readable new pages, no page-level horizontal overflow, and keyboard navigation to the example. The code block scrolls independently and accepts keyboard focus. This is local browser QA, not a participant study or mobile-device test.
- Final rule review reproduced over-selection of webhook requirements for an outbound-only integration. Added `incomingEvents` applicability and a regression test; generic integration alone no longer selects `services.events`.
- Final CLI quality gate: **77 tests passed**, formatting/lint/types/build/package checks passed. Package: **167 files, 348,180 bytes** unpacked. No runtime dependency, command or completion-gate changes.
- Final CRM estimate (`ceil(joined text length/4)`): part 513; master + part + skill 1,918; with index/baseline/quality references 3,009. Reference instructions now explicitly reuse current inline rules instead of requiring duplicate reads. These are text estimates, not measured agent token savings.
- Public GitHub clone at `393ab9621789edc7f691a49ec1b8f1a94a459900` passed fresh install/build/link/relink/create/verify/unlink with isolated npm and Git configuration. That public revision does **not** contain this initiative's local improvements.
- Direct global Git install failed with exit 127 (`tsc: command not found`) on npm 10.9.8 with a custom prefix/cache; corrected the stale install-guide explanation. The documented clone and tarball routes work; no upstream npm compatibility fix is claimed.
- Local working-source ZIP extraction (no `.git`), fresh `npm ci`, build/link/create/verify/unlink passed. Guarded skill copy passed; repeat returned 1 and preserved a user-owned file; backup/refresh/removal passed outside scanned directories. An initial ZIP test harness had an undefined variable; it was corrected and rerun in a fresh fixture.
- Latest unauthenticated production check returned **HTTP 401**. Read-only Sites inspection reports custom owner-only access. No access settings were changed. Public readiness remains pending, regardless of local crawler tests.

## Findings, ranked

| Severity | Finding and disposition | Files |
| --- | --- | --- |
| Medium | Constraints disappeared in expand/recompress; fixed and regression-tested | `src/core/plannable-plan.ts`, `src/core/markdown-import.ts`, `tests/guidance-integration.test.ts` |
| Medium | Broad integration fact selected irrelevant incoming-event work; reproduced and narrowed before release | `templates/guidance/services.json`, `src/core/guidance/types.ts`, `tests/guidance.test.ts` |
| Medium | Direct Git install fails in tested npm/custom-prefix configuration; unsupported route documented, clone/tarball alternatives verified | `docs/INSTALL.md:55` |
| Medium, launch blocker | Live site requires authentication; public discovery cannot be validated | `site/.openai/hosting.json`, `DISCOVERY.md` |
| Low | Site install snippets could continue after clone failure; aligned with guarded README command | `site/app/page.tsx`, `site/app/docs/getting-started/page.tsx` |
| Low | Canonicals and crawler resources used different origin rules; shared origin and rendered regression added | `site/app/_lib/site-origin.ts`, `site/tests/rendered-html.test.mjs` |

## Final test matrix

| Path | Result / limits |
| --- | --- |
| CLI quality gate, legacy behavior and compact-format fixtures | Passed: 77 tests |
| Conditional scope, uncertainty, exclusions, conversion, missing mappings | Passed; deterministic tests, not model evaluation |
| Disabled authorization/query/containment demonstrations | Passed; illustrative controls, not generated applications |
| Packed global/local CLI, executable shims, moved source, references, repeat/uninstall | Passed in temporary paths with spaces on macOS |
| Public GitHub clone/build/link and relink/unlink | Passed at `393ab96`; older capability set |
| Current local source ZIP extract/build/link/unlink | Passed; working-source archive, not a published ZIP |
| Direct public Git install with custom prefix/cache | Failed: exit 127; not recommended |
| Skill copy, repeat refusal, backup/refresh/removal | Passed; complete references included, user file preserved |
| Native agent discovery | Previous audit executed Codex/Claude discovery; not rerun for this change. Current copy/reference checks are not discovery tests |
| Cursor UI, account uploads, plugin ZIPs | Untested UI/uploads; plugin packaging unsupported |
| Site lint/build/render and local desktop/mobile keyboard QA | Passed: 11 rendered tests plus browser observations |
| Published feature artifact and public crawler access | Not released; current live page returns 401 |
| Windows/Linux CI for this diff | Not run locally |
| Non-technical pilot, repeated-model comparison, ranking/citation improvement | Untested; no outcome claims |

## Release steps and useful next improvements

1. Review this diff, run cross-platform CI, then authorize Git/release publication. Retest the exact published artifact; update unreleased labels only after users can install it. Exact safe install/update/uninstall commands remain in [INSTALL.md](../../INSTALL.md).
2. Run the participant pilot and controlled model comparison from VALIDATION.md. They test understanding and actual agent behavior that deterministic fixtures cannot establish.
3. Authorize public site access/deployment separately, then verify unauthenticated pages, canonicals and crawler resources. Only then collect a Search Console baseline and 30/60/90-day observations.
4. Add release-artifact installation checks across npm versions and native Cursor discovery to cover the remaining packaging/platform gap. Measure full context with a real tokenizer before making new efficiency claims.

Artifacts retained locally: `/tmp/plannable-security-final-check.log`, `/tmp/plannable-security-site-check.log`; isolated source-validation results under the system temporary directories `plannable source validation trhteoc2` (public clone/Git) and `plannable source validation op3sxplb` (local ZIP/copy). These results were recorded before Git publication. The owner authorized detailed commits and a push to main on 2026-09-18; npm publication and site deployment remain separate.

## Pre-push review — 2026-09-18

Site lint/build and all 11 rendered tests passed again. Concurrent checks exposed process timeouts (checkout test, CLI build hook, packed install); a separate rerun reproduced the build-hook timeout under heavy host load. Increased only their timeout limits to 30/60/120 seconds respectively, preserving all assertions. The subsequent full `npm run check` passed all 77 tests in 17.24 seconds, plus formatting, lint, types, build and package checks (348,180 bytes). Logs: `/tmp/plannable-prepush-final.log` and `/tmp/plannable-prepush-site.log`. Root and initiative verification passed 49 and 48 checks.
