import path from "node:path";
import { readProjectText, writeProjectText } from "../core/filesystem.js";
import { parseOptions } from "../core/options.js";

// Name resolution: explicit argument > package.json "name" > directory name.
async function inferProjectName(cwd: string): Promise<string> {
  try {
    const pkg = JSON.parse(await readProjectText(cwd, "package.json")) as { name?: unknown };
    if (typeof pkg.name === "string" && pkg.name.trim()) {
      return pkg.name.trim();
    }
  } catch {
    // no package.json or unparseable — fall through to directory name
  }
  return path.basename(cwd) || "Existing Project";
}

export async function initCommand(cwd: string, args: string[]): Promise<void> {
  const options = parseOptions(args);
  const overwrite = Boolean(options.values.force);
  const projectName = options.positional.join(" ").trim() || (await inferProjectName(cwd));

  await writeProjectText(
    cwd,
    "MASTER_PLAN.md",
    [
      "# MASTER_PLAN.md",
      "",
      "## Product Goal",
      "Describe the product goal.",
      "",
      "## Product Scenarios",
      "",
      "## Phase 1: Planning",
      ""
    ].join("\n"),
    overwrite
  );

  await writeProjectText(
    cwd,
    "PLAN_STATE.md",
    [
      "# PLAN_STATE.md",
      "",
      `Project: ${projectName}`,
      `Created: ${new Date().toISOString()}`,
      "",
      "## Current Part",
      "",
      "Next: COMPLETE",
      "",
      "## Parts",
      "",
      "## Notes",
      "",
      "- `plannable init` creates blank files for existing projects.",
      '- Use `plannable create "CRM"` when you want generated scenarios.'
    ].join("\n"),
    overwrite
  );

  await writeProjectText(
    cwd,
    "PLAN_EVIDENCE.md",
    ["# PLAN_EVIDENCE.md", "", `Project: ${projectName}`, "", "## Evidence Log", "", "No evidence recorded yet."].join(
      "\n"
    ),
    overwrite
  );

  await writeProjectText(cwd, "plans/.gitkeep", "", true);

  console.log(`Initialized blank Plannable files for "${projectName}".`);
  console.log('Use plannable create "CRM" instead when you want generated scenarios.');
}
