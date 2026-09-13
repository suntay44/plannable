# Verified improvements — 2026-09-11

Local, uncommitted changes following [the installation audit](INSTALL_AUDIT.md). No publishing or account configuration changes. Validation ran on macOS with Node 22.22.3 and npm 10.9.8.

## Findings and changes

| Priority | Confirmed problem | Small correction and evidence |
| --- | --- | --- |
| P1 | Windows CI screenshot shows Prettier rejecting 40 files. A temporary Git checkout with `core.autocrlf=true` reproduced CRLF output and exit 1. | `.gitattributes` requires LF for text; Prettier explicitly uses LF. The same checkout passes with the rule. `tests/checkout.test.ts` protects this. Actual Windows execution remains untested. |
| P2 | Generated plans suggested npm commands and file paths absent from the target project. | `src/core/project-context.ts` reads existing directories and common package scripts. Uses declared/detected npm, pnpm, Yarn or Bun; ambiguous/unknown checks stay explicit placeholders. Does not execute scripts or infer frameworks. |
| P2 | Title normalization changed request flags and identifiers; imports discarded prose, fenced commands and stop conditions. | Preserve the original request in context when normalization changes it. `src/core/markdown-import.ts` retains those Markdown elements; expansion restores code indentation and stop conditions. Existing compressed content stays unchanged. Unterminated fences fail before writing. |
| P2 | Expanding numeric names could turn `2FA` into `FA`; imported verification commands acquired `?`. | Remove only one list marker and preserve explicit commands. Regression fixtures check both. |
| P2 | Audited development dependencies contained two high-severity findings. | Lockfile-only updates: brace-expansion 5.0.8 → 5.0.9 and nanoid 3.3.16 → 3.3.18. Fresh `npm ci` succeeds; audit reports zero high and two moderate findings. Vitest update attempts failed inside npm (`edgesOut`); that update remains unresolved. |
| P3 | Generated completion instructions duplicated state edits; acceptance fallback merely repeated tasks. | Use evidence followed by `plannable complete`; warn specifically on the copied fallback criteria. No broad claim of semantic contradiction detection. |

The two development npm subprocess launchers now use Node plus `npm_execpath` under npm scripts. Direct invocation retains a Windows shell fallback because `.cmd` files cannot be launched directly with `execFile`. This is documentation-backed portability work, not an observed Windows test pass: [Node documentation](https://nodejs.org/api/child_process.html#spawning-bat-and-cmd-files-on-windows).

The line-ending correction follows [Prettier guidance](https://prettier.io/docs/options#end-of-line). The [reported GitHub run](https://github.com/suntay44/plannable/actions/runs/30385611768/job/90364039356) has not been rerun with these unpublished changes.

## Measured efficiency and limits

- Across 21 fixed sample parts, estimated tokens fell from 6,924 to 6,428: **7.2%**. Tests retain scenario tasks, acceptance criteria, prior outcomes, and evidence gates. This is the existing `ceil(string.length / 4)` heuristic, not model-tokenizer measurement or total conversation cost. Detected project checks and longer requests change actual output size.
- Each of the four skill descriptions shrank from 362 to 234 characters: **35.4%**. Model activation precision was not benchmarked.
- Imports remain a limited Markdown conversion: list hierarchy and rich formatting are not losslessly reconstructed. Preserving a request does not automatically resolve conflicting scenario hints; agents must review them.

## Validation

| Check | Result |
| --- | --- |
| `npm run check` | Passed: 59 tests, formatting, lint, typecheck, build and package validation |
| Real packed global/project installs, repeat, moved source, resources, uninstall | Passed in isolated paths with spaces; included in the 59 tests |
| Windows-style Git checkout and Prettier | Reproduced failure, then passed with attributes; executed on macOS |
| `node dist/cli.js verify` | Passed: 49 checks; no plan completion/state changes |
| `git diff --check` | Passed |
| Actual Windows/Linux CI, Cursor UI, published fixed Git/registry installs | Untested; see installation audit for prior platform discovery coverage |

## Remaining improvements

1. Repair the isolated npm/Vitest update failure and rerun checks: clears remaining development advisories without a forced dependency upgrade.
2. Add release-ref installation smoke tests after publishing: local package tests cannot prove remote Git or registry delivery.
3. Measure full context with a real tokenizer and benchmark skill activation: validates cost and relevance beyond shorter text.
4. Consider structured command/exit-code evidence: distinguishes executed checks from assertions, but needs a compatible design before changing the evidence format.

Review these changes, then rerun the cross-platform CI matrix after an explicitly authorized push. Retest the exact public Git commit before recommending direct Git installation. npm installation remains unavailable until registry publication. Exact current source, packed, and skill commands are in [INSTALL.md](INSTALL.md).
