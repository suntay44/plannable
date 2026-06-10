import path from "node:path";
import { appendEvidence, hasEvidenceForPart } from "../core/evidence.js";
import { readText, writeText } from "../core/filesystem.js";
import { allValues, firstValue, parseOptions } from "../core/options.js";
import { parseMasterPartStatuses } from "../core/master-plan.js";
import {
  assertPartHasEvidence,
  findPartById,
  markPartCompleteInMaster,
  normalizePartId
} from "../core/progress.js";
import { regenerateState } from "../core/state.js";

export async function completeCommand(cwd: string, args: string[]): Promise<void> {
  const options = parseOptions(args);
  const [partArg] = options.positional;
  if (!partArg) {
    throw new Error('Usage: plannable complete PART-001 --summary "what changed" --artifact "npm test"');
  }

  const partId = normalizePartId(partArg);
  const masterPath = path.join(cwd, "MASTER_PLAN.md");
  const statePath = path.join(cwd, "PLAN_STATE.md");
  const evidencePath = path.join(cwd, "PLAN_EVIDENCE.md");

  const master = await readText(masterPath);
  const state = await readText(statePath);
  let evidence = await readText(evidencePath);
  findPartById(master, partId);

  const summary = firstValue(options, "summary");
  if (!hasEvidenceForPart(evidence, partId) && summary) {
    const artifacts = [
      ...allValues(options, "artifact"),
      ...allValues(options, "file").map((value) => `Changed file: ${value}`),
      ...allValues(options, "check").map((value) => `Check: ${value}`),
      ...allValues(options, "note").map((value) => `Note: ${value}`)
    ];
    evidence = appendEvidence(evidence, { partId, summary, artifacts });
    await writeText(evidencePath, evidence, true);
  }

  assertPartHasEvidence(evidence, partId);

  const nextMaster = markPartCompleteInMaster(master, partId);
  const finalEvidence = evidence;
  const nextState = regenerateState(state, parseMasterPartStatuses(nextMaster), (partLabel) => hasEvidenceForPart(finalEvidence, partLabel));

  await writeText(masterPath, nextMaster, true);
  await writeText(statePath, nextState, true);

  console.log(`Completed ${partId}.`);
  console.log("Next: plannable status");
}
