import path from "node:path";
import { appendEvidence, hasEvidenceForPart } from "../core/evidence.js";
import { readText, writeText } from "../core/filesystem.js";
import { parseMasterPartStatuses } from "../core/master-plan.js";
import { allValues, parseOptions } from "../core/options.js";
import { findPartById, markEvidenceRecordedInMaster, normalizePartId, partNumberFromId } from "../core/progress.js";
import { regenerateState } from "../core/state.js";

export async function evidenceCommand(cwd: string, args: string[]): Promise<void> {
  const options = parseOptions(args);
  const [partArg, ...summaryParts] = options.positional;
  if (!partArg || summaryParts.length === 0) {
    throw new Error('Usage: plannable evidence PART-001 "summary" --artifact "npm test"');
  }

  const partId = normalizePartId(partArg);
  const summary = summaryParts.join(" ").trim();
  const masterPath = path.join(cwd, "MASTER_PLAN.md");
  const statePath = path.join(cwd, "PLAN_STATE.md");
  const evidencePath = path.join(cwd, "PLAN_EVIDENCE.md");
  const master = await readText(masterPath);
  const state = await readText(statePath);
  findPartById(master, partId);

  const artifacts = [
    ...allValues(options, "artifact"),
    ...allValues(options, "file").map((value) => `Changed file: ${value}`),
    ...allValues(options, "check").map((value) => `Check: ${value}`),
    ...allValues(options, "note").map((value) => `Note: ${value}`)
  ];

  const evidence = await readText(evidencePath);
  const alreadyRecorded = hasEvidenceForPart(evidence, partId);
  const nextEvidence = appendEvidence(evidence, { partId, summary, artifacts });
  const nextMaster = markEvidenceRecordedInMaster(master, partNumberFromId(partId));
  const nextState = regenerateState(state, parseMasterPartStatuses(nextMaster), (partLabel) => hasEvidenceForPart(nextEvidence, partLabel));

  await writeText(evidencePath, nextEvidence, true);
  await writeText(masterPath, nextMaster, true);
  await writeText(statePath, nextState, true);

  if (options.values.json) {
    console.log(JSON.stringify({ ok: true, partId, summary, artifacts, alreadyRecorded, next: `plannable complete ${partId}` }, null, 2));
    return;
  }

  console.log(`Recorded evidence for ${partId}.`);
  if (alreadyRecorded) {
    console.log(`Note: ${partId} already had evidence; this entry was appended as additional evidence.`);
  }
  console.log("Next: plannable complete " + partId);
}
