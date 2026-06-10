import path from "node:path";
import { hasEvidenceForPart } from "../core/evidence.js";
import { readText, writeText } from "../core/filesystem.js";
import { parseMasterPartStatuses } from "../core/master-plan.js";
import { parseOptions } from "../core/options.js";
import { markEvidenceRecordedInMaster } from "../core/progress.js";
import { regenerateState } from "../core/state.js";

type RepairSummary = {
  changed: boolean;
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
  const masterPath = path.join(cwd, "MASTER_PLAN.md");
  const statePath = path.join(cwd, "PLAN_STATE.md");
  const evidencePath = path.join(cwd, "PLAN_EVIDENCE.md");

  let master = await readText(masterPath);
  const state = await readText(statePath);
  const evidence = await readText(evidencePath);
  const changes: string[] = [];

  for (const part of parseMasterPartStatuses(master)) {
    const partId = `PART-${String(part.partNumber).padStart(3, "0")}`;
    if (hasEvidenceForPart(evidence, partId)) {
      const masterBefore = master;
      master = markEvidenceRecordedInMaster(master, part.partNumber);
      if (master !== masterBefore) {
        changes.push(`marked MASTER_PLAN.md evidence recorded for ${partId}`);
      }
    }
  }

  const nextState = regenerateState(state, parseMasterPartStatuses(master), (partLabel) => hasEvidenceForPart(evidence, partLabel));
  if (nextState !== state) {
    changes.push("regenerated PLAN_STATE.md from MASTER_PLAN.md and PLAN_EVIDENCE.md");
  }

  if (!dryRun && changes.length > 0) {
    await writeText(masterPath, master, true);
    await writeText(statePath, nextState, true);
  }

  return { changed: changes.length > 0 && !dryRun, changes };
}
