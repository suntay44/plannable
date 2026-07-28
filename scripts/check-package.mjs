import { execFile } from "node:child_process";
import console from "node:console";
import { readFile } from "node:fs/promises";
import { URL } from "node:url";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);
const { stdout } = await execFileAsync("npm", ["pack", "--dry-run", "--ignore-scripts", "--json"], {
  maxBuffer: 2 * 1024 * 1024
});
const [pack] = JSON.parse(stdout);
const paths = new Set(pack.files.map((file) => file.path));
const pkg = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));

const required = [
  "package.json",
  "README.md",
  "LICENSE",
  "dist/cli.js",
  "templates/PART_PLAN.ai.md",
  ".agents/skills/plannable/SKILL.md",
  ".codex/skills/plannable/SKILL.md",
  ".claude/skills/plannable/SKILL.md",
  ".cursor/skills/plannable/SKILL.md"
];
const missing = required.filter((file) => !paths.has(file));
const forbidden = [...paths].filter(
  (file) => file.endsWith("settings.local.json") || file.includes("/.env") || file.startsWith(".env")
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
