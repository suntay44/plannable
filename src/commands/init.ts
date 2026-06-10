import path from "node:path";
import { writeText } from "../core/filesystem.js";

export async function initCommand(cwd: string, args: string[]): Promise<void> {
  const overwrite = args.includes("--force");

  await writeText(path.join(cwd, "MASTER_PLAN.md"), [
    "# MASTER_PLAN.md",
    "",
    "## Product Goal",
    "Describe the product goal.",
    "",
    "## Product Scenarios",
    "",
    "## Phase 1: Planning",
    ""
  ].join("\n"), overwrite);

  await writeText(path.join(cwd, "PLAN_STATE.md"), [
    "# PLAN_STATE.md",
    "",
    "Project: Existing Project",
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
    "- Use `plannable create \"CRM\"` when you want generated scenarios."
  ].join("\n"), overwrite);

  await writeText(path.join(cwd, "PLAN_EVIDENCE.md"), [
    "# PLAN_EVIDENCE.md",
    "",
    "Project: Existing Project",
    "",
    "## Evidence Log",
    "",
    "No evidence recorded yet."
  ].join("\n"), overwrite);

  await writeText(path.join(cwd, "plans", ".gitkeep"), "", true);

  console.log("Initialized blank Plannable files.");
  console.log('Use plannable create "CRM" instead when you want generated scenarios.');
}
