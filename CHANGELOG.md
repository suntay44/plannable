# Changelog

All notable changes to Plannable are documented here.
Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). Versioning: [SemVer](https://semver.org/).

## [Unreleased]

### Fixed
- `plannable evidence` now notes when a part already had evidence instead of silently appending a duplicate entry.
- `plannable repair --dry-run --json` now reports `changed: true` when drift is found; a new `applied` field says whether files were written.
- Evidence placeholder matching tolerates hand-edited variants (italics, missing period, trailing whitespace).

### Added
- `plannable init` accepts a project name: `plannable init "Legacy Billing Service"`.
- CONTRIBUTING.md and this changelog.

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
