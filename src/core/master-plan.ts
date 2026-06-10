import { readTemplate } from "./filesystem.js";
import { type PlanModel, renderTemplate } from "./templates.js";
import { type PartStatus } from "./state.js";

function renderScenarios(model: PlanModel): string {
  return model.scenarios
    .map((scenario) => [
      `### ${scenario.id}: ${scenario.title}`,
      `Outcome: ${scenario.outcome}`
    ].join("\n"))
    .join("\n\n");
}

function renderParts(model: PlanModel): string {
  return model.scenarios
    .map((scenario, index) => [
      `- [ ] Part ${index + 1}: Read \`plans/PART${index + 1}_PLAN.ai.md\``,
      `  - Scenario: ${scenario.id}`,
      `  - Outcome: ${scenario.partOutcome}`,
      "  - Evidence: pending"
    ].join("\n"))
    .join("\n\n");
}

function articleFor(productName: string): string {
  return /^[aeiou]/i.test(productName) ? `an ${productName}` : `a ${productName}`;
}

export async function renderMasterPlan(model: PlanModel): Promise<string> {
  const template = await readTemplate("MASTER_PLAN.md");
  return renderTemplate(template, {
    productArticle: articleFor(model.productName),
    productGoal: model.productGoal,
    phaseName: model.phaseName,
    scenarios: renderScenarios(model),
    parts: renderParts(model)
  });
}

export function parseMasterPartStatuses(masterContent: string): PartStatus[] {
  const lines = masterContent.split(/\r?\n/);
  const parts: PartStatus[] = [];
  let currentPhase: string | undefined;

  for (let index = 0; index < lines.length; index += 1) {
    const phaseMatch = lines[index].match(/^##\s+(Phase\b.*)$/);
    if (phaseMatch) {
      currentPhase = phaseMatch[1].trim();
      continue;
    }

    const match = lines[index].match(/^- \[( |x|X)\] Part (\d+):\s*Read `([^`]+)`/);
    if (!match) {
      continue;
    }

    const partNumber = Number(match[2]);
    const scenarioId = lines[index + 1]?.match(/Scenario:\s*(.+)$/)?.[1]?.trim() ?? "UNKNOWN";
    const outcome = lines[index + 2]?.match(/Outcome:\s*(.+)$/)?.[1]?.trim() ?? "UNKNOWN";
    const evidence = lines[index + 3]?.match(/Evidence:\s*(recorded|pending)/i)?.[1]?.toLowerCase() === "recorded"
      ? "recorded"
      : "pending";

    parts.push({
      partNumber,
      path: match[3].trim(),
      scenarioId,
      outcome,
      status: match[1].toLowerCase() === "x" ? "complete" : "pending",
      evidence,
      phase: currentPhase
    });
  }

  return parts;
}
