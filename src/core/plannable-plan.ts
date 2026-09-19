import { guidanceWarnings } from "./guidance/diagnostics.js";
import { renderGuidance } from "./guidance/render.js";
import { extractSectionedItems } from "./markdown-import.js";
import { type ProjectContext, UNKNOWN_CHECKS } from "./project-context.js";
import { readTemplate } from "./filesystem.js";
import { type PlanModel, renderTemplate, type Scenario } from "./templates.js";

export const PLANNABLE_PLAN_HEADER = "@PlannablePlan v0.1";
const REQUIRED_FIELDS = ["ID", "PH", "SCN", "OUT"] as const;
const REQUIRED_BLOCKS = ["T", "AC", "V", "DONE", "S"] as const;

export type PlannablePlanSummary = {
  id?: string;
  phase?: string;
  scenarioId?: string;
  outcome?: string;
  goal?: string;
};

export type ParsedPlannablePlan = PlannablePlanSummary & {
  context: string[];
  constraints: string[];
  tasks: string[];
  acceptanceCriteria: string[];
  verification: string[];
  completionUpdates: string[];
  stopConditions: string[];
};

export type ValidationResult = {
  ok: boolean;
  errors: string[];
  warnings: string[];
};

function numberedList(items: string[]): string {
  return items.map((item, index) => `${index + 1} ${item}`).join("\n");
}

function bulletList(items: string[]): string {
  return items.map((item) => `- ${item}`).join("\n");
}

export function hasValidHeader(content: string): boolean {
  return content.trimStart().startsWith(PLANNABLE_PLAN_HEADER);
}

export function parsePlannablePlan(content: string): ParsedPlannablePlan {
  return {
    ...parsePlanSummary(content),
    context: parseBlock(content, "CTX"),
    constraints: parseBlock(content, "C"),
    tasks: parseBlock(content, "T"),
    acceptanceCriteria: parseBlock(content, "AC"),
    verification: parseBlock(content, "V"),
    completionUpdates: parseBlock(content, "DONE"),
    stopConditions: parseBlock(content, "S")
  };
}

export function validatePlannablePlan(content: string): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (/@PlanPack\b/.test(content)) {
    errors.push("Uses old @PlanPack name.");
  }
  if (!hasValidHeader(content)) {
    errors.push(
      content.includes("@PlannablePlan") ? "Missing @PlannablePlan v0.1 header." : "Missing @PlannablePlan header."
    );
  }
  if (looksBinaryOrBase64(content)) {
    errors.push("Content looks binary/base64-like instead of semantically readable.");
  }

  for (const field of REQUIRED_FIELDS) {
    if (!parseField(content, field)) {
      errors.push(`Missing required field: ${field}`);
    }
  }

  const parsed = parsePlannablePlan(content);
  if (parsed.tasks.length === 0) {
    errors.push("Missing or empty T task block.");
  }
  if (parsed.acceptanceCriteria.length === 0) {
    errors.push("Missing or empty AC acceptance criteria block.");
  }
  if (parsed.verification.length === 0) {
    errors.push("Missing or empty V verification block.");
  }
  if (parsed.completionUpdates.length === 0) {
    errors.push("Missing or empty DONE completion block.");
  }
  if (parsed.stopConditions.length === 0) {
    errors.push("Missing or empty S stop conditions block.");
  }

  const copiedCriteria = new Set(parsed.tasks.map((task) => `- Completed: ${stripListMarker(task)}`));
  if (parsed.acceptanceCriteria.length > 0 && parsed.acceptanceCriteria.every((item) => copiedCriteria.has(item))) {
    warnings.push("Acceptance criteria repeat tasks; replace them with observable outcomes.");
  }

  if (!content.includes("DICT:")) {
    warnings.push("Optional DICT block is missing.");
  }
  if (parsed.context.length === 0) {
    warnings.push(
      "Optional CTX context block is missing. Each part should carry compressed phase context (product, prior parts, next part)."
    );
  }

  warnings.push(
    ...guidanceWarnings({
      CTX: parsed.context,
      C: parsed.constraints,
      T: parsed.tasks,
      AC: parsed.acceptanceCriteria,
      V: parsed.verification
    })
  );
  return { ok: errors.length === 0, errors, warnings };
}

export function parsePartId(content: string): string | undefined {
  return parseField(content, "ID") ?? content.match(/^id:\s*(.+)$/m)?.[1]?.trim();
}

export function parseScenarioId(content: string): string | undefined {
  return parseField(content, "SCN") ?? content.match(/^scenario:\s*(.+)$/m)?.[1]?.trim();
}

export function parseOutcome(content: string): string | undefined {
  return parseField(content, "OUT") ?? content.match(/^outcome:\s*(.+)$/m)?.[1]?.trim();
}

export function parseGoal(content: string): string | undefined {
  const goalBlock = parseBlock(content, "G");
  return (goalBlock[0] && stripListMarker(goalBlock[0]).trim()) || content.match(/^goal:\s*(.+)$/m)?.[1]?.trim();
}

export function parsePlanSummary(content: string): PlannablePlanSummary {
  return {
    id: parsePartId(content),
    phase: parseField(content, "PH"),
    scenarioId: parseScenarioId(content),
    outcome: parseOutcome(content),
    goal: parseGoal(content)
  };
}

export function missingRequiredBlocks(content: string): string[] {
  return REQUIRED_BLOCKS.filter((blockName) => parseBlock(content, blockName).length === 0);
}

export async function renderPartPlan(
  model: PlanModel,
  scenario: Scenario,
  index: number,
  project?: ProjectContext
): Promise<string> {
  const template = await readTemplate("PART_PLAN.ai.md");
  const partNumber = index + 1;
  const nextScenario = model.scenarios[index + 1];
  const nextPart = nextScenario ? `PART-${String(index + 2).padStart(3, "0")}` : "COMPLETE";

  const priorContext =
    index === 0
      ? "none (first part)"
      : model.scenarios
          .slice(0, index)
          .map((prior, priorIndex) => `PART-${String(priorIndex + 1).padStart(3, "0")}: ${prior.partOutcome}`)
          .join("; ");
  const nextContext = nextScenario ? `${nextPart}: ${nextScenario.partOutcome}` : "COMPLETE — run plannable verify";

  return renderTemplate(template, {
    ...renderGuidance(project?.guidance),
    partId: `PART-${String(partNumber).padStart(3, "0")}`,
    partNumber: String(partNumber),
    partCount: String(model.scenarios.length),
    phase:
      model.phaseName
        .toUpperCase()
        .replace(/[^A-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "") || "CORE",
    phaseName: model.phaseName,
    scenarioId: scenario.id,
    dependsOn: index === 0 ? "[]" : `[PART-${String(index).padStart(3, "0")}]`,
    nextPart,
    goal: scenario.title,
    outcome: scenario.partOutcome,
    productName: model.productName,
    productGoal: model.productGoal,
    priorContext,
    nextContext,
    steps: numberedList(scenario.steps),
    acceptanceCriteria: bulletList(scenario.doneWhen),
    requestContext: model.request ? `\n- request: ${JSON.stringify(model.request)}` : "",
    files: (project?.files ?? ["? identify files for this part"]).join("\n"),
    verification: bulletList(project?.verification ?? UNKNOWN_CHECKS)
  });
}

export function expandPartPlan(content: string): string {
  return expandPlannablePlan(content);
}

export function expandPlannablePlan(content: string): string {
  const parsed = parsePlannablePlan(content);

  return [
    `# ${parsed.id ?? "UNKNOWN"}`,
    "",
    `Scenario: ${parsed.scenarioId ?? "UNKNOWN"}`,
    "",
    `Goal: ${parsed.goal ?? "Unspecified goal"}`,
    "",
    `Outcome: ${parsed.outcome ?? "Unspecified outcome"}`,
    "",
    "## Context",
    renderReadableList(parsed.context),
    "",
    "## Constraints",
    renderReadableList(parsed.constraints),
    "",
    "## Tasks",
    renderReadableList(parsed.tasks),
    "",
    "## Acceptance Criteria",
    renderReadableList(parsed.acceptanceCriteria),
    "",
    "## Verification",
    renderReadableList(parsed.verification),
    "",
    "## Completion",
    renderReadableList(parsed.completionUpdates),
    "",
    "## Stop Conditions",
    renderReadableList(parsed.stopConditions)
  ].join("\n");
}

export function renderPlanFromMarkdown(input: string, fallbackName = "Imported Plan"): string {
  return compressToPlannablePlan(input, fallbackName);
}

export function estimateTokens(content: string): number {
  return Math.ceil(content.length / 4);
}

export function compressToPlannablePlan(input: string, fallbackName = "Imported Plan"): string {
  if (hasValidHeader(input)) return input;
  const title = input.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallbackName;
  const sections = extractSectionedItems(input);

  const tasks =
    sections.tasks.length > 0
      ? sections.tasks
      : ["Inspect the source plan and identify the next concrete implementation task."];
  const acceptance =
    sections.acceptance.length > 0 ? sections.acceptance : tasks.slice(0, 3).map((task) => `Completed: ${task}`);
  const verification = sections.verification.length > 0 ? sections.verification : UNKNOWN_CHECKS;
  const context = [
    `source: imported from "${title}"`,
    ...sections.context,
    "enrich: add stack, conventions, and prior-work context before implementing"
  ];

  return [
    PLANNABLE_PLAN_HEADER,
    "",
    "ID=PART-001",
    "PH=IMPORTED",
    "SCN=SCN-001",
    `OUT=${title} implementation slice works`,
    "DEP=[]",
    "",
    "DICT:",
    "G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion; S=stop",
    "",
    "G:",
    `- ${title}`,
    "",
    "CTX:",
    ...context.map((item) => `- ${item}`),
    "",
    "C:",
    "- preserve-existing-work",
    "- avoid-unrelated-edits",
    "- ask-before-new-deps",
    ...sections.constraints.map((item) => `- ${item}`),
    "",
    "F:",
    "? identify files for this part",
    "",
    "T:",
    ...tasks.map((task, index) => `${index + 1} ${task}`),
    "",
    "AC:",
    ...acceptance.map((item) => `- ${item}`),
    "",
    "V:",
    ...verification.map((item) => `- ${item}`),
    "",
    "DONE:",
    "- append PLAN_EVIDENCE.md#PART-001: summary+files+checks+notes",
    "- run plannable complete PART-001",
    "",
    "S:",
    ...sections.stop.map((item) => `- ${item}`),
    "- if source plan is ambiguous, stop and ask",
    "- if required project context is missing, record the blocker"
  ].join("\n");
}

function parseField(content: string, field: string): string | undefined {
  return content.match(new RegExp(`^${field}\\s*=\\s*(.+)$`, "m"))?.[1]?.trim();
}

function parseBlock(content: string, blockName: string): string[] {
  const lines = content.split(/\r?\n/);
  const start = lines.findIndex((line) => line.trim() === `${blockName}:`);
  if (start === -1) {
    return [];
  }

  const items: string[] = [];
  for (const line of lines.slice(start + 1)) {
    const trimmed = line.trim();
    if (trimmed && (/^[A-Z][A-Z_]*:$/.test(trimmed) || /^[A-Z][A-Z_]*\s*=/.test(trimmed))) {
      break;
    }
    if (trimmed) {
      items.push(trimmed);
    }
  }

  return items;
}

function stripListMarker(item: string): string {
  return item.replace(/^(?:[-+?]\s+|\d+[.)]?\s+)/, "");
}

function renderReadableList(items: string[]): string {
  return items.length > 0 ? items.map(renderReadableItem).join("\n") : "- None listed";
}

function renderReadableItem(item: string): string {
  const value = stripListMarker(item);
  const code = value.match(/^code\[(.*?)\]: (".*")$/);
  if (code) {
    try {
      const body: unknown = JSON.parse(code[2]);
      if (typeof body === "string") {
        const width = (body.match(/`+/g) ?? []).reduce((max, run) => Math.max(max, run.length + 1), 3);
        const fence = "`".repeat(width);
        return `${fence}${code[1]}\n${body}\n${fence}`;
      }
    } catch {
      // Hand-edited non-JSON values remain visible as ordinary list text.
    }
  }
  return `- ${value}`;
}

function looksBinaryOrBase64(content: string): boolean {
  const compact = content.replace(/\s+/g, "");
  if (compact.length < 200) {
    return false;
  }

  const base64Chars = compact.match(/[A-Za-z0-9+/=]/g)?.length ?? 0;
  const ratio = base64Chars / compact.length;
  return ratio > 0.96 && !/[ :\n-]/.test(content.slice(0, 500));
}
