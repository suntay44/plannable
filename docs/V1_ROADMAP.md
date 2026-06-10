# V1 Roadmap

## v0.1

- Initial TypeScript CLI.
- Initial Codex, Claude Code, and Cursor skills.
- Initial `@PlannablePlan v0.1` format.
- Basic create, run-next, status, verify, compress, and expand commands.

## v0.3

- Stronger PlannablePlan validation.
- Vitest coverage for parsing, validation, CLI generation, status, and verification failures.
- Better CRM, TODO app, restaurant homepage, and arbitrary software-plan scenario hints.
- Evidence, complete, and doctor helper commands.
- Machine-readable `--json` output for run-next, status, verify, and doctor.
- Basic repair command for common drift.
- Clear optional role for `init`.

## v0.5

- Real-world testing with Codex, Claude Code, and Cursor.
- Stable command behavior across common project layouts.
- Better error messages and repair suggestions.
- More scenario hints for common implementation domains.
- Clean npm pack/link testing.

## v1.0

Requirements:

- Stable `@PlannablePlan` spec with no expected breaking changes.
- Reliable CLI commands for create, run-next, status, verify, evidence, complete, doctor, compress, and expand.
- `create` fully sets up the planning system.
- Tests passing in CI and locally.
- Examples complete and verified.
- Docs clear for terminal, Codex, Claude Code, and Cursor users.
- Completion rules enforced structurally.
- No known major platform confusion.
- npm package install, link, and pack flows verified.
- GitHub repository and npm publishing metadata finalized.
