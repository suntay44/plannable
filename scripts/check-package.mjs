import { execFile } from "node:child_process";
import console from "node:console";
import process from "node:process";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const npmCli = process.env.npm_execpath;
const args = ["pack", "--dry-run", "--ignore-scripts", "--json"];
const { stdout } = await execFileAsync(npmCli ? process.execPath : "npm", npmCli ? [npmCli, ...args] : args, {
  // Direct invocation on Windows needs a shell for npm.cmd; npm scripts use Node directly.
  shell: !npmCli && process.platform === "win32",
  maxBuffer: 2 * 1024 * 1024
});
await execFileAsync(process.execPath, ["scripts/sync-guidance.mjs", "--check"]);
const [pack] = JSON.parse(stdout);
const paths = new Set(pack.files.map((file) => file.path));
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

const required = [
  "package.json",
  "README.md",
  "LICENSE",
  "dist/cli.js",
  "templates/PART_PLAN.ai.md",
  "templates/MASTER_PLAN.md",
  "templates/PLAN_STATE.md",
  "templates/PLAN_EVIDENCE.md",
  ".agents/skills/plannable/agents/openai.yaml",
  ".codex/skills/plannable/agents/openai.yaml",
  ".cursor/commands/plannable.md",
  ".cursor/rules/plannable.mdc",
  ".agents/skills/plannable/SKILL.md",
  ".codex/skills/plannable/SKILL.md",
  ".claude/skills/plannable/SKILL.md",
  ".cursor/skills/plannable/SKILL.md"
];
for (const name of ["baseline", "access", "data", "input", "services", "quality"]) {
  required.push(`templates/guidance/${name}.json`);
  for (const platform of [".agents", ".codex", ".claude", ".cursor"])
    required.push(`${platform}/skills/plannable/references/${name}.md`);
}
for (const platform of [".agents", ".codex", ".claude", ".cursor"])
  required.push(`${platform}/skills/plannable/references/guidance.md`);
const missing = required.filter((file) => !paths.has(file));
const forbidden = [...paths].filter(
  (file) =>
    file.endsWith("settings.local.json") ||
    file.includes("/.env") ||
    file.startsWith(".env") ||
    file.startsWith("docs/initiatives/")
);

if (missing.length > 0) {
  throw new Error(`Package is missing required files: ${missing.join(", ")}`);
}
if (forbidden.length > 0) {
  throw new Error(`Package contains local or sensitive files: ${forbidden.join(", ")}`);
}
if (pkg.dependencies && Object.keys(pkg.dependencies).length > 0) {
  throw new Error("Plannable must remain free of runtime dependencies.");
}
if (pack.unpackedSize > 400_000) {
  throw new Error(`Package grew beyond the 400 KB budget: ${pack.unpackedSize} bytes`);
}

console.log(`Package check passed: ${pack.entryCount} files, ${pack.unpackedSize} bytes unpacked.`);
