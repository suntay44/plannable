# Changelog

All notable changes to Plannable are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Fixed
- `plannable evidence` now notes when a part already had evidence instead of silently appending a duplicate entry.
- `plannable repair --dry-run --json` now reports `changed: true` when drift is found; a new `applied` field says whether files were written.
- Evidence placeholder matching tolerates hand-edited variants (italics, missing period, trailing whitespace).

### Added
- `plannable init` labels the project automatically from `package.json` or the directory name; pass a name only to override (`plannable init "Legacy Billing Service"`).
- `--json` output for `plannable evidence` and `plannable complete` — the whole workflow loop is now machine-readable.
- `plannable verify` prints only failures, warnings, and a summary by default; `--verbose` lists every passing check.
- Unknown commands suggest the closest match ("did you mean \"status\"?").
- `--json`, `--force`, `--dry-run`, and `--verbose` are documented in `plannable --help`.
- CONTRIBUTING.md and this changelog.

### Changed
- `plannable create` in a directory that already has a plan explains `--force` instead of printing a raw filesystem error.
- `plannable complete` points to `plannable run-next` (or `verify` when the plan is done) instead of `status`.
- Boolean flags (`--json`, `--force`, `--dry-run`, `--verbose`) can appear anywhere in the argument list without swallowing the next argument.

## [1.0.0] - 2026-06-10

### Added
- `plannable create` — scenario-driven MASTER_PLAN.md plus compressed PlannablePlan `.ai.md` part files, with scenario hints for CRM, TODO, restaurant, billing, mobile, and API domains.
- `CTX:` block in every part file carrying the product goal, prior part outcomes, and next part, so agents work from one file.
- Evidence-gated completion: `plannable complete` refuses to check off a part without recorded evidence.
- Generated `PLAN_STATE.md`: rebuilt wholesale from MASTER_PLAN.md + PLAN_EVIDENCE.md by `evidence`, `complete`, and `repair` — no state drift.
- `plannable verify` structural checks plus warnings for generic draft wording.
- `plannable compress` / `plannable expand` with estimated token savings.
- `--json` output for `run-next`, `status`, `verify`, `doctor`, and `repair`.
- `--version` flag; friendly error when no plan exists in the directory.
- Skill files for Claude Code (`.claude/`), Codex (`.agents/`, `.codex/` mirror), and Cursor (`.cursor/`).
- PlannablePlan v0.1 spec with stability and parser-tolerance policy (CRLF, spaces around `=`).
- Zero runtime dependencies.

[Unreleased]: https://github.com/suntay44/Plannable/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/suntay44/Plannable/releases/tag/v1.0.0
