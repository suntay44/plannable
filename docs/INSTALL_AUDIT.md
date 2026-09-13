# Installation audit — 2026-09-08

Scope: CLI + standalone skills, preserving existing workflows. Public GitHub revision: `b93b23b027026e8ef39ad81a73e21b25f356eca7`. Local fixes are uncommitted and unpublished. Earlier compact-plan edits were preserved.

Environment: macOS arm64, Node 22.22.3, npm 10.9.8, Codex CLI 0.153.4, Claude Code 2.1.224. Tests used temporary homes, npm prefixes/caches/config files, agent config directories, and consumer projects. No actual account settings, installed plugins, or credentials were changed. No commits, pushes, or publishing occurred.

## Findings, ranked

| Priority | Finding | Resolution / reference |
| --- | --- | --- |
| P1 | README clone failure could continue into an unrelated existing `Plannable` directory and execute its npm build scripts. Reproduced with a marker-writing fixture. | Stop on every failure with `&&`; clone into a new quoted path. [README](../README.md#install), regression in [installation.test.ts](../tests/installation.test.ts). |
| P1 | Direct public Git dependency installation exited 0 but had no `bin/plannable`; `dist` was absent. `prepack` alone did not prepare the Git dependency. | Replace build hook with `prepare` in [package.json](../package.json). Local lifecycle/package tests pass; corrected remote Git installation still requires publishing and retesting. |
| P2 | `agents/openai.yaml` declared unsupported top-level command metadata; actual Codex discovery omitted the interface. | Use documented `interface` fields; align the compatibility mirror. Native discovery now returns display name, description, and prompt. |
| P2 | Guide conflated standalone skills with plugins; did not define personal/local destinations, CLI prerequisite, copy collisions, refresh, or uninstall. | [INSTALL.md](INSTALL.md) now separates routes, guards copies, documents scopes/custom paths, and avoids unreviewed overwrite/update operations. |
| P2 | npm registry installation is unavailable: `npm view`, fresh global install, and isolated `npx` return 404. | Explicitly mark registry commands as future instructions; public clone/build route is verified. |
| P3 | README claimed every workflow command supports JSON; examples omitted required evidence artifacts, and Cursor rule encouraged hand-editing generated state. | Name supported JSON commands, fix evidence examples, and use CLI state regeneration. |

No `.codex-plugin/plugin.json`, `.claude-plugin/plugin.json`, `.cursor-plugin/plugin.json`, marketplace catalog, or standalone installer script exists. This is intentional scope, not a missing feature added by the audit. `package.json` is the npm manifest; `agents/openai.yaml` is optional skill UI metadata, not a plugin manifest.

## Test matrix

“Passed” means executed unless qualified. “Unsupported” is not a platform test pass.

| Path | Public version | Local fixes / limits |
| --- | --- | --- |
| Public GitHub clone → install/build/link → CLI outside checkout | Passed | Fresh `npm ci`/build/link passed |
| README clone into occupied unrelated Git project | Failed: unrelated build ran | Passed: exit 128, no build or lockfile changes |
| Direct `npm install -g git+https://…` | Failed: exit 0, no executable | `prepare` and real package installs passed; fixed remote Git path **untested until published** |
| Registry global / fresh `npx` | Failed: 404, exit 1 | Unavailable until npm publication |
| Public source ZIP → extract/build/link | Passed | ZIP is source, not a plugin upload |
| Actual tarball → global and project-local installation | Passed | Passed, including paths with spaces and isolated prefixes |
| Installed templates and CLI after source moved | Passed for packed install | Passed; version/create/run-next/verify/evidence/complete/status executed |
| Repeated link/install and CLI uninstall | Passed | Passed; executable/package removed, consumer-owned file retained |
| Build failure | Not specifically injected | Passed: malformed source config makes `npm ci` exit 2 with compiler error |
| Codex personal/project discovery | Passed, UI metadata ignored | Passed via `skills/list`; corrected metadata returned |
| Codex custom `CODEX_HOME`, forced refresh, removal | Passed where exercised | Passed for `$HOME/.agents/skills` and `$CODEX_HOME/skills`; removal absent after reload |
| Claude personal/custom config/project discovery and removal | Personal/custom passed | Passed in actual CLI startup `skills` and `slash_commands`; fresh processes, no authenticated model execution |
| Guarded standalone skill copy / repeat | No deterministic snippet | Passed: first copy 0, repeat 1, existing destination preserved |
| Plugin manifest validation | Claude validator rejects source, exit 1 | Unsupported; no plugin manifests introduced |
| Namespaced plugin command discovery | Not applicable | Standalone `/plannable` discovered; no `/plannable:plannable` promised |
| Cursor discovery, wrappers, reload | Documentation/files inspected | **Untested UI**; Cursor not installed in audit environment |
| Plugin ZIP / individual skill account upload | Unsupported/unverified | No account uploads performed; formats checked against official docs |
| Windows/Linux and other Node/npm versions | Existing CI matrix inspected | **Not executed locally**; run CI before release |
| Natural-language install request / model-driven skill invocation | Manual steps exercised | **Untested end-to-end model behavior** |

Regression coverage: [installation.test.ts](../tests/installation.test.ts) exercises prepare, real packed local/global installs, resources, moved source, repeated installation, uninstall, metadata, and clone-failure isolation. [check-package.mjs](../scripts/check-package.mjs) now requires every runtime template and key agent resources, beyond just the part template.

Official platform/lifecycle sources and exact install/update/uninstall commands are in [INSTALL.md](INSTALL.md). Native discovery checks are not UI automation or proof of model execution. Forced reload is not a test of automatic file watching. The source-link method needs its checkout; packed installs do not.

Final validation: `npm run check` passed all 48 tests, formatting, lint, typecheck, build, and package checks. `plannable verify` passed 49 checks. `git diff --check` passed.

## Improvement candidates recorded during this audit

Several candidates below were subsequently implemented and tested. See [verified improvements](IMPROVEMENTS.md) for current results, limits, and remaining work; the table records the original proposals.

| Priority | Improvement | Why / bounded first step |
| --- | --- | --- |
| High | Detect existing stack and available checks | Improve relevance: derive `V` and file hints from actual project manifests instead of always suggesting npm/UI paths. Keep explicit overrides. |
| High | Preserve the original request and explicit exclusions | Improve accuracy: store a short verbatim constraint summary so scenario hints do not replace user intent. Separate facts from assumptions. |
| High | Warn on vague criteria and contradictory context | Improve usefulness: detect placeholder paths/checks and acceptance criteria that merely restate tasks; remain advisory for v0.1 compatibility. |
| High | Patch flagged development dependencies | Source installation audit reports high-severity advisories for `brace-expansion` and `nanoid`; runtime dependencies remain zero. Review small lockfile updates and rerun CI separately. |
| Medium | Measure full per-step context with a real tokenizer | Improve efficiency measurement: report master + active part + instructions separately; current `length/4` estimate is only a heuristic. Do not trim requirements to hit a budget. |
| Medium | Preserve more Markdown semantics during compression | Improve accuracy: add round-trip fixtures for fenced commands, multiline requirements, stop conditions, and dependency links before extending the importer. |
| Medium | Record structured check results | Improve evidence usefulness: optionally record command, exit code, timestamp, and artifact path, distinguishing executed checks from manual assertions. |
| Medium | Shorten and narrow skill descriptions | Reduce automatic context cost and irrelevant activation; benchmark representative trigger/non-trigger prompts and keep platform differences explicit. |
| Medium | Release-level installation smoke tests | Catch published-only failures: test the release Git ref and registry tarball in clean environments; add Cursor UI/Windows shell testing without claiming simulated discovery is equivalent. |
| Later | Optional genuine plugin packaging | Only if requested: separate platform manifests/catalogs, lifecycle tests, and namespaced invocation docs. Preserve standalone skills and CLI. |

## Publishing still needed

Review the local diff and run the cross-platform CI matrix; publish the reviewed GitHub changes. Then retest direct Git installation at that exact commit. To enable registry installation, follow [RELEASING.md](RELEASING.md): establish npm ownership/trusted publishing, select the release version, publish, and smoke-test the registry artifact. Neither task was performed during this audit.
