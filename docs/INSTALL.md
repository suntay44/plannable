# Install

Plannable is a skill, not a hosted plugin. Install the terminal CLI and **one** matching standalone skill separately. Copying `SKILL.md` does not install Node.js or the CLI. No plugin manifest, marketplace catalog, or automatic skill installer is shipped.

Commands below use a POSIX shell (macOS/Linux), Node.js 22+, npm, and Git. Quote paths containing spaces. Windows CLI packaging is covered by CI; these shell snippets are not PowerShell instructions.

## CLI from the public GitHub link

This source route works before npm publication. Clone into a **new** directory outside the project you want to plan:

```bash
git clone https://github.com/suntay44/Plannable.git "Plannable source" &&
cd "Plannable source" &&
npm ci &&
npm run build &&
npm link &&
plannable --version
```

Keep this checkout: `npm link` points the global CLI at it. Use `npm ci` with development dependencies to build from source. Do not use `--ignore-scripts` or `--omit=dev` for source/Git installation. Never use `--force` to replace another executable.

If the global prefix is not writable, choose your own prefix without editing npm configuration:

```bash
NPM_CONFIG_PREFIX="$HOME/.local" npm link &&
export PATH="$HOME/.local/bin:$PATH"
```

Use that same `NPM_CONFIG_PREFIX` value for subsequent global install/uninstall commands. Restart the agent if its environment has not picked up the new PATH.

## Packed global or project-local CLI

A packed install keeps working after the source checkout is moved. From the built checkout:

```bash
npm pack
```

For version 1.0.0 this writes `plannable-1.0.0.tgz`. Use the filename printed by npm for other versions. Choose one:

```bash
npm install -g "/absolute/path/Plannable source/plannable-1.0.0.tgz"
```

Or, in the **target project**:

```bash
npm install --save-dev "/absolute/path/Plannable source/plannable-1.0.0.tgz" &&
./node_modules/.bin/plannable --version
```

The local route intentionally updates that project's `package.json` and lockfile. Use `./node_modules/.bin/plannable` in place of `plannable` below, or an npm script. Plain `plannable` is not automatically on PATH in a normal shell after a local install.

## npm registry and direct Git installs

As checked on 2026-09-08, the public npm registry returns 404 for `plannable`. These are **future commands after publication**, not current installation instructions:

```bash
npm install -g plannable
npx plannable create "CRM"
```

The audited public GitHub revision `b93b23b` also lets `npm install -g git+https://github.com/suntay44/Plannable.git` exit 0 without installing the executable. Use the clone/build route above. The local `prepare` hook fix must be published and the remote installation retested before recommending the direct Git shortcut.

## Install one agent skill

Set the source to your checkout, or the installed package directory (for example `/your/project/node_modules/plannable`). Select the row for your agent and scope:

| Agent | Source folder | Personal destination | Project destination |
| --- | --- | --- | --- |
| Codex | `.agents/skills/plannable` | `$HOME/.agents/skills/plannable` | `.agents/skills/plannable` |
| Claude Code | `.claude/skills/plannable` | `${CLAUDE_CONFIG_DIR:-$HOME/.claude}/skills/plannable` | `.claude/skills/plannable` |
| Cursor | `.cursor/skills/plannable` | `$HOME/.cursor/skills/plannable` | `.cursor/skills/plannable` |

Example: personal Codex installation. Set the three variables for another row. For a project destination, use the target project's absolute path, not the Plannable checkout.

```bash
plannable_source="/absolute/path/Plannable source"
plannable_skill_source="$plannable_source/.agents/skills/plannable"
plannable_skill_parent="$HOME/.agents/skills"
test -f "$plannable_skill_source/SKILL.md" &&
mkdir -p "$plannable_skill_parent" &&
mkdir "$plannable_skill_parent/plannable" &&
cp -R "$plannable_skill_source/." "$plannable_skill_parent/plannable/"
```

`mkdir` deliberately refuses an existing destination, including a symlink, with a nonzero exit; the `&&` chain prevents overwriting or nesting an existing skill. Review any partial copy after an I/O failure before retrying. Do not copy entire `.agents`, `.claude`, or `.cursor` trees over your configuration.

Codex's documented personal path remains `$HOME/.agents/skills` when `CODEX_HOME` changes. Its bundled installer may use `$CODEX_HOME/skills`; the CLI tested in this audit also discovers that location. The `.codex/skills/plannable` source mirror is for compatibility, not a reason to install a duplicate. Cursor can discover other agents' skill folders too; install only one copy per scope.

Cursor's `.cursor/commands/plannable*.md` wrappers and `.cursor/rules/plannable.mdc` are optional. The skill already supplies `/plannable`. If you use wrappers, copy only the named files into the target project's matching folders after checking each destination is absent. Preserve other commands/rules. Wrapper names follow filenames: `/plannable-create`, `/plannable-run-next`, etc.; `/plannable create a CRM` passes arguments to the main skill/command.

## Discovery and refresh

- **Codex:** `/skills` or `$plannable` in CLI/IDE; use the Skills selector in the desktop app. Newly added skills should appear automatically; restart if needed.
- **Claude Code:** `/plannable` is a standalone skill. Check `/help` (Custom commands) or the skill picker. Restart if a new top-level skill directory is not watched.
- **Cursor:** inspect Customize → Skills and type `/plannable`. Legacy wrappers may need an editor reload. Cursor UI discovery was not exercised in this audit.

There is no `/plannable:plannable` plugin command in this distribution. Claude's `plugin-name:skill-name` namespace applies to actual plugins, not these standalone skills. CLI subcommands are arguments, not separately registered Codex commands.

## ZIPs and uploads are different surfaces

- **GitHub source ZIP:** extract the whole archive into a new directory, enter its top-level `Plannable-...` folder, then run `npm ci`, `npm run build`, and `npm link`. It has no `.git`; update by extracting a new ZIP, not by running `git pull` in a parent repository.
- **Plugin ZIP / marketplace URL:** unsupported by this repository. OpenAI and Claude use different plugin manifests and distribution requirements; neither can be inferred from `package.json` or `agents/openai.yaml`.
- **Individual skill upload:** an account UI upload does not install the local CLI. Claude's custom-skill ZIP structure is `plannable/SKILL.md` plus any supporting files, not the entire GitHub source ZIP. Account upload, Cowork, and ChatGPT Work execution are not validated installation routes here; they require a compatible execution environment with the CLI available.

## Repeat, update, and uninstall

Repeating `npm link` or installing the same tarball is supported. Repeating the guarded skill copy stops without changing existing files. Copies do not auto-update when the CLI updates.

For updates, clone a reviewed revision into a new directory (or extract a new source ZIP), build, and relink or install the new tarball. This avoids pulling/resetting an unrelated repository. For skill updates, compare your installed files against the new source; move the old skill into a unique backup directory **outside every scanned skills directory**, then repeat the guarded copy. Preserve and merge personal changes. Refresh discovery and smoke-test before deleting backups.

Uninstall the CLI with the matching route/prefix:

```bash
npm unlink -g plannable                         # linked source
npm uninstall -g plannable                      # packed or registry global
npm uninstall --save-dev plannable              # inside the local consumer project
```

Remove a copied skill by moving only its `plannable` folder to a backup outside discovery. Remove only reviewed Plannable wrapper/rule files if installed. Never delete a whole config directory. CLI uninstall leaves copied skills, source checkouts, and generated plans intact; these are separate resources.

## Verify or ask an agent

Run the installed executable in a new temporary folder, outside the source checkout:

```bash
plannable_smoke="$(mktemp -d)" &&
cd "$plannable_smoke" &&
plannable create "CRM" &&
plannable status &&
plannable run-next &&
plannable verify
```

Expected: `MASTER_PLAN.md`, `PLAN_STATE.md`, `PLAN_EVIDENCE.md`, and `plans/`; one pending part printed; structural verification passes. Generic drafts can warn that enrichment is needed. An existing plan is refused without `--force`; do not use that flag for installation smoke tests.

Agent install prompt:

```txt
Look at this GitHub repo and install Plannable for my current agent app:
https://github.com/suntay44/Plannable

Follow docs/INSTALL.md. Install the CLI and one matching standalone skill in my chosen scope. Preserve existing files, use a new source directory, and verify the installed executable in a temporary project. Report actual discovery separately from documentation-only checks.
```

Official references: [Codex skills](https://learn.chatgpt.com/docs/build-skills), [OpenAI plugins](https://learn.chatgpt.com/docs/build-plugins), [Claude Code skills](https://code.claude.com/docs/en/skills), [Claude settings](https://code.claude.com/docs/en/settings), [Claude plugins](https://code.claude.com/docs/en/plugins), [Claude skill ZIPs](https://support.claude.com/en/articles/12512198-how-to-create-custom-skills), [Cursor skills](https://cursor.com/docs/skills), [npm lifecycle scripts](https://docs.npmjs.com/cli/v11/using-npm/scripts/).
