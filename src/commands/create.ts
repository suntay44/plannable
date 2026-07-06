import path from "node:path";
import { renderMasterPlan } from "../core/master-plan.js";
import { renderPartPlan } from "../core/plannable-plan.js";
import { renderPlanState } from "../core/state.js";
import { buildPlanModel } from "../core/templates.js";
import { pathExists, readTemplate, writeText } from "../core/filesystem.js";

export type CreateOptions = {
  cwd: string;
  args: string[];
  overwrite?: boolean;
};

export async function createCommand(options: CreateOptions): Promise<void> {
  const productInput = options.args.filter((arg) => arg !== "--force").join(" ").trim();
  const overwrite = options.overwrite ?? options.args.includes("--force");

  if (!productInput) {
    throw new Error('Usage: plannable create "CRM"');
  }

  if (!overwrite && await pathExists(path.join(options.cwd, "MASTER_PLAN.md"))) {
    throw new Error(
      "A Plannable plan already exists here.\nRun: plannable create \"<product idea>\" --force to regenerate it (this discards current progress)."
    );
  }

  const model = buildPlanModel(productInput);
  const createdAt = new Date().toISOString();

  await writeText(path.join(options.cwd, "MASTER_PLAN.md"), await renderMasterPlan(model), overwrite);
  await writeText(path.join(options.cwd, "PLAN_STATE.md"), await renderPlanState(model, createdAt), overwrite);
  await writeText(
    path.join(options.cwd, "PLAN_EVIDENCE.md"),
    (await readTemplate("PLAN_EVIDENCE.md")).replaceAll("{{productName}}", model.productName),
    overwrite
  );

  for (const [index, scenario] of model.scenarios.entries()) {
    await writeText(
      path.join(options.cwd, "plans", `PART${index + 1}_PLAN.ai.md`),
      await renderPartPlan(model, scenario, index),
      overwrite
    );
  }

  console.log(`Created Plannable project for ${model.productName}`);
  console.log("Next: plannable run-next");
}

