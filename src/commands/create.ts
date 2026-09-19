import { loadGuidance } from "../core/guidance/catalog.js";
import { selectGuidance } from "../core/guidance/select.js";
import { detectProjectContext } from "../core/project-context.js";
import { renderMasterPlan } from "../core/master-plan.js";
import { renderPartPlan } from "../core/plannable-plan.js";
import { renderPlanState } from "../core/state.js";
import { buildPlanModel } from "../core/templates.js";
import { pathExists, readTemplate, resolveProjectPath, writeProjectText } from "../core/filesystem.js";
import { parseOptions } from "../core/options.js";

export type CreateOptions = {
  cwd: string;
  args: string[];
  overwrite?: boolean;
};

export async function createCommand(options: CreateOptions): Promise<void> {
  const parsed = parseOptions(options.args);
  const productInput = parsed.positional.join(" ").trim();
  const overwrite = options.overwrite ?? Boolean(parsed.values.force);

  if (!productInput) {
    throw new Error('Usage: plannable create "CRM"');
  }

  if (!overwrite && (await pathExists(resolveProjectPath(options.cwd, "MASTER_PLAN.md")))) {
    throw new Error(
      'A Plannable plan already exists here.\nRun: plannable create "<product idea>" --force to regenerate it (this discards current progress).'
    );
  }

  const model = buildPlanModel(productInput);
  const project = await detectProjectContext(options.cwd);
  project.guidance = selectGuidance(await loadGuidance(), project.facts);
  const createdAt = new Date().toISOString();

  await writeProjectText(
    options.cwd,
    "MASTER_PLAN.md",
    (await renderMasterPlan(model)) +
      "\n## Planning safeguards\n\nRoutine secret handling and behavior checks are included in each part. Before coding, inspect this project and add applicable safeguards using the installed skill references. Record owner decisions and unknowns here. These are planned checks, not proof of application security.\n",
    overwrite
  );
  await writeProjectText(options.cwd, "PLAN_STATE.md", await renderPlanState(model, createdAt), overwrite);
  await writeProjectText(
    options.cwd,
    "PLAN_EVIDENCE.md",
    (await readTemplate("PLAN_EVIDENCE.md")).replaceAll("{{productName}}", model.productName),
    overwrite
  );

  for (const [index, scenario] of model.scenarios.entries()) {
    await writeProjectText(
      options.cwd,
      `plans/PART${index + 1}_PLAN.ai.md`,
      await renderPartPlan(model, scenario, index, project),
      overwrite
    );
  }

  console.log(`Created Plannable project for ${model.productName}`);
  console.log("Next: plannable run-next");
}
