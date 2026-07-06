import path from "node:path";
import { readText } from "../core/filesystem.js";
import { parseMasterPartStatuses } from "../core/master-plan.js";
import { parseOptions } from "../core/options.js";
import { estimateTokens } from "../core/plannable-plan.js";
import { type PartStatus } from "../core/state.js";

export type RunNextSummary = {
  next: PartStatus | null;
  instruction: string[];
  content?: string;
  estimatedTokens?: number;
};

export async function getRunNextSummary(cwd: string, includeContent = true): Promise<RunNextSummary> {
  const masterPath = path.join(cwd, "MASTER_PLAN.md");
  const master = await readText(masterPath);
  const next = parseMasterPartStatuses(master).find((part) => part.status === "pending");

  if (!next) {
    return {
      next: null,
      instruction: ["Run plannable verify to confirm completion evidence."]
    };
  }

  const content = includeContent ? await readText(path.join(cwd, next.path)) : undefined;
  return {
    next,
    instruction: [
      "Read MASTER_PLAN.md, then load only the part file above.",
      "Implement only this part.",
      "Do not check off until evidence is written."
    ],
    content,
    estimatedTokens: content === undefined ? undefined : estimateTokens(content)
  };
}

export async function runNextCommand(cwd: string, args: string[] = []): Promise<void> {
  const options = parseOptions(args);
  const json = Boolean(options.values.json);
  const summary = await getRunNextSummary(cwd, !json);

  if (json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  if (!summary.next) {
    console.log("No pending Plannable parts found.");
    console.log("Run plannable verify to confirm completion evidence.");
    return;
  }

  console.log(`Next part: P${summary.next.partNumber}`);
  if (summary.next.phase) {
    console.log(`Phase: ${summary.next.phase}`);
  }
  console.log(`Scenario: ${summary.next.scenarioId}`);
  console.log(`Outcome: ${summary.next.outcome}`);
  console.log(`Load only: ${summary.next.path}`);
  if (summary.estimatedTokens !== undefined) {
    console.log(`Context cost: ~${summary.estimatedTokens} tokens (this part is all the plan context needed)`);
  }
  console.log("");
  console.log("Agent instruction:");
  for (const line of summary.instruction) {
    console.log(line);
  }
  console.log("");

  console.log(summary.content?.trimEnd());
}
