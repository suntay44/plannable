# V1 Audit

## Working Well

- `plannable create "CRM"` creates the complete planning structure without requiring `init`.
- `CRM`, `TODO app`, and `restaurant homepage` use useful scenario hints.
- Arbitrary software plan names produce create/manage/review scenario plans instead of blank placeholders.
- Generated `.ai.md` files use `@PlannablePlan v0.1` and symbolic `ID`, `PH`, `SCN`, `OUT`, `T`, `AC`, `V`, `DONE`, and `S` sections.
- Codex, Claude Code, and Cursor skill files exist with platform-specific launchers.
- Examples show progressive loading, pending parts, and evidence-backed completion.
- Tests cover CLI creation, next-part detection, compression, expansion, validation failure cases, evidence, completion, and doctor checks.
- Unit tests now cover core part-id helpers, master-plan updates, generated state, option parsing, compression, validation, and installation documentation.
- `plannable evidence`, `plannable complete`, and `plannable doctor` cover the main evidence/checkoff loop.
- `--json` output exists for `run-next`, `status`, `verify`, and `doctor`.
- `plannable repair` fixes common evidence/current-part drift.
- `npm pack`, `npm link`, and clean-project install smoke tests have passed locally.
- Install docs now cover CLI, source install, Codex Desktop/Codex CLI, Claude Code, Cursor, and a plain-language "look at this GitHub repo and install Plannable" prompt.

## Missing

- End-to-end testing inside Codex, Claude Code, and Cursor has not been performed yet.
- The Markdown compressor is intentionally simple and not semantic enough for complex plans.
- Repair handles common safe drift, but not deeper structural rewrite cases.
- The package has not been published to npm yet.

## Broken Or Weak

- `init` was previously too close to `create`; it is now optional and blank, but needs real-world testing.
- Verification is structural, not behavioral. It can prove evidence exists, but not that product code actually satisfies a scenario.
- Error messages are clearer than v0.1, but they are not yet grouped by severity everywhere.

## Recommended Next Changes

- Add repair suggestions for common failed checks.
- Publish only after GitHub remote, initial commit, and final package metadata review.
- Test skill install/use flows in Codex, Claude Code, and Cursor.
- Improve compression from existing Markdown implementation plans.
- Repeat `npm pack`, `npm link`, and clean-project install smoke tests immediately before publishing.
