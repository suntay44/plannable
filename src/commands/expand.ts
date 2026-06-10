import path from "node:path";
import { readText } from "../core/filesystem.js";
import { expandPartPlan, hasValidHeader } from "../core/plannable-plan.js";

export async function expandCommand(cwd: string, args: string[]): Promise<void> {
  const inputPath = args[0] ? path.resolve(cwd, args[0]) : path.join(cwd, "plans", "PART1_PLAN.ai.md");
  const content = await readText(inputPath);

  if (!hasValidHeader(content)) {
    throw new Error(`${inputPath} is not a PlannablePlan v0.1 file.`);
  }

  console.log(expandPartPlan(content));
}

