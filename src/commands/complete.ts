import { appendEvidence, hasEvidenceForPart } from "../core/evidence.js";
import { readProjectText, writeProjectText } from "../core/filesystem.js";
import { allValues, firstValue, parseOptions } from "../core/options.js";
import { parseMasterPartStatuses } from "../core/master-plan.js";
import { assertPartHasEvidence, findPartById, markPartCompleteInMaster, normalizePartId } from "../core/progress.js";
import { regenerateState } from "../core/state.js";

export async function completeCommand(cwd: string, args: string[]): Promise<void> {
  const options = parseOptions(args);
  const [partArg] = options.positional;
  if (!partArg) {
    throw new Error('Usage: plannable complete PART-001 --summary "what changed" --artifact "npm test"');
  }

  const partId = normalizePartId(partArg);
  const master = await readProjectText(cwd, "MASTER_PLAN.md");
  const state = await readProjectText(cwd, "PLAN_STATE.md");
  let evidence = await readProjectText(cwd, "PLAN_EVIDENCE.md");
  findPartById(master, partId);

  const summary = firstValue(options, "summary");
  if (!hasEvidenceForPart(evidence, partId) && summary) {
    const artifacts = [
      ...allValues(options, "artifact"),
      ...allValues(options, "file").map((value) => `Changed file: ${value}`),
      ...allValues(options, "check").map((value) => `Check: ${value}`),
      ...allValues(options, "note").map((value) => `Note: ${value}`),
      ...allValues(options, "unavailable").map((value) => `Unavailable: ${value}`)
    ];
    evidence = appendEvidence(evidence, { partId, summary, artifacts });
    await writeProjectText(cwd, "PLAN_EVIDENCE.md", evidence, true);
  }

  assertPartHasEvidence(evidence, partId);

  const nextMaster = markPartCompleteInMaster(master, partId);
  const finalEvidence = evidence;
  const nextState = regenerateState(state, parseMasterPartStatuses(nextMaster), (partLabel) =>
    hasEvidenceForPart(finalEvidence, partLabel)
  );

  await writeProjectText(cwd, "MASTER_PLAN.md", nextMaster, true);
  await writeProjectText(cwd, "PLAN_STATE.md", nextState, true);

  const nextPart = parseMasterPartStatuses(nextMaster).find((part) => part.status === "pending");
  const next = nextPart ? "plannable run-next" : "plannable verify";

  if (options.values.json) {
    console.log(JSON.stringify({ ok: true, partId, completed: true, nextPart: nextPart?.path ?? null, next }, null, 2));
    return;
  }

  console.log(`Completed ${partId}.`);
  console.log(`Next: ${next}`);
}
