import { readTemplate } from "./filesystem.js";
import { type PlanModel, renderTemplate } from "./templates.js";

export type PartStatus = {
  partNumber: number;
  path: string;
  scenarioId: string;
  outcome: string;
  status: "pending" | "complete";
  evidence: "pending" | "recorded";
  phase?: string;
};

function renderStateParts(model: PlanModel): string {
  return model.scenarios
    .map((scenario, index) => [
      `- [ ] Part ${index + 1}: plans/PART${index + 1}_PLAN.ai.md`,
      `  - Scenario: ${scenario.id}`,
      `  - Outcome: ${scenario.partOutcome}`,
      "  - Evidence: pending"
    ].join("\n"))
    .join("\n\n");
}

export async function renderPlanState(model: PlanModel, createdAt: string): Promise<string> {
  const template = await readTemplate("PLAN_STATE.md");
  return renderTemplate(template, {
    productName: model.productName,
    createdAt,
    parts: renderStateParts(model)
  });
}

export function parsePartStatuses(stateContent: string): PartStatus[] {
  const lines = stateContent.split(/\r?\n/);
  const parts: PartStatus[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const match = lines[index].match(/^- \[( |x|X)\] Part (\d+):\s*(.+)$/);
    if (!match) {
      continue;
    }

    const partNumber = Number(match[2]);
    const path = match[3].trim();
    const scenarioId = lines[index + 1]?.match(/Scenario:\s*(.+)$/)?.[1]?.trim() ?? "UNKNOWN";
    const outcome = lines[index + 2]?.match(/Outcome:\s*(.+)$/)?.[1]?.trim() ?? "UNKNOWN";
    const evidence = lines[index + 3]?.match(/Evidence:\s*(recorded|pending)/i)?.[1]?.toLowerCase() === "recorded"
      ? "recorded"
      : "pending";

    parts.push({
      partNumber,
      path,
      scenarioId,
      outcome,
      status: match[1].toLowerCase() === "x" ? "complete" : "pending",
      evidence
    });
  }

  return parts;
}

export function nextPendingPart(stateContent: string): PartStatus | undefined {
  return parsePartStatuses(stateContent).find((part) => part.status === "pending");
}

export function parseCurrentPartPath(stateContent: string): string | undefined {
  return stateContent.match(/^Next:\s*(.+)$/m)?.[1]?.trim();
}

/**
 * PLAN_STATE.md is a generated view. MASTER_PLAN.md checkboxes and
 * PLAN_EVIDENCE.md entries are the source of truth; this rebuilds the
 * state file from them, preserving the Project/Created header lines.
 */
export function regenerateState(
  existingState: string,
  masterParts: PartStatus[],
  hasEvidence: (partLabel: string) => boolean
): string {
  const project = existingState.match(/^Project:\s*(.+)$/m)?.[1]?.trim() ?? "Unknown Project";
  const created = existingState.match(/^Created:\s*(.+)$/m)?.[1]?.trim() ?? new Date().toISOString();
  const nextPath = masterParts.find((part) => part.status === "pending")?.path ?? "COMPLETE";

  const partLines = masterParts
    .map((part) => {
      const partLabel = `PART-${String(part.partNumber).padStart(3, "0")}`;
      const evidence = part.evidence === "recorded" || hasEvidence(partLabel) ? "recorded" : "pending";
      return [
        `- [${part.status === "complete" ? "x" : " "}] Part ${part.partNumber}: ${part.path}`,
        `  - Scenario: ${part.scenarioId}`,
        `  - Outcome: ${part.outcome}`,
        `  - Evidence: ${evidence}`
      ].join("\n");
    })
    .join("\n\n");

  return [
    "# PLAN_STATE.md",
    "",
    `Project: ${project}`,
    `Created: ${created}`,
    "",
    "## Current Part",
    "",
    `Next: ${nextPath}`,
    "",
    "## Parts",
    "",
    partLines,
    "",
    "## Notes",
    "",
    "- This file is generated from MASTER_PLAN.md and PLAN_EVIDENCE.md.",
    "- Read only the next pending part file.",
    "- Run plannable repair to regenerate after manual edits.",
    ""
  ].join("\n");
}
