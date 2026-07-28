import { hasEvidenceForPart } from "../core/evidence.js";
import { readProjectText, writeProjectText } from "../core/filesystem.js";
import { parseMasterPartStatuses } from "../core/master-plan.js";
import { parseOptions } from "../core/options.js";
import { setEvidenceStatusInMaster } from "../core/progress.js";
import { regenerateState } from "../core/state.js";

type RepairSummary = {
  changed: boolean;
  applied: boolean;
  changes: string[];
};

export async function repairCommand(cwd: string, args: string[] = []): Promise<void> {
  const options = parseOptions(args);
  const dryRun = Boolean(options.values["dry-run"]);
  const json = Boolean(options.values.json);
  const summary = await repairPlan(cwd, dryRun);

  if (json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  if (summary.changes.length === 0) {
    console.log("No repairable Plannable drift found.");
    return;
  }

  for (const change of summary.changes) {
    console.log(`${dryRun ? "Would repair" : "Repaired"}: ${change}`);
  }
}

async function repairPlan(cwd: string, dryRun: boolean): Promise<RepairSummary> {
  let master = await readProjectText(cwd, "MASTER_PLAN.md");
  const state = await readProjectText(cwd, "PLAN_STATE.md");
  const evidence = await readProjectText(cwd, "PLAN_EVIDENCE.md");
  const changes: string[] = [];

  for (const part of parseMasterPartStatuses(master)) {
    const partId = `PART-${String(part.partNumber).padStart(3, "0")}`;
    const evidenceStatus = hasEvidenceForPart(evidence, partId) ? "recorded" : "pending";
    const masterBefore = master;
    master = setEvidenceStatusInMaster(master, part.partNumber, evidenceStatus);
    if (master !== masterBefore) {
      changes.push(`marked MASTER_PLAN.md evidence ${evidenceStatus} for ${partId}`);
    }
  }

  const nextState = regenerateState(state, parseMasterPartStatuses(master), (partLabel) =>
    hasEvidenceForPart(evidence, partLabel)
  );
  if (nextState !== state) {
    changes.push("regenerated PLAN_STATE.md from MASTER_PLAN.md and PLAN_EVIDENCE.md");
  }

  if (!dryRun && changes.length > 0) {
    await writeProjectText(cwd, "MASTER_PLAN.md", master, true);
    await writeProjectText(cwd, "PLAN_STATE.md", nextState, true);
  }

  return { changed: changes.length > 0, applied: changes.length > 0 && !dryRun, changes };
}
