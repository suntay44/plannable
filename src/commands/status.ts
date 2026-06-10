import path from "node:path";
import { readText } from "../core/filesystem.js";
import { hasEvidenceForPart } from "../core/evidence.js";
import { parseEvidencePartIds } from "../core/evidence.js";
import { parseMasterPartStatuses } from "../core/master-plan.js";
import { parseOptions } from "../core/options.js";
import { parseCurrentPartPath, parsePartStatuses } from "../core/state.js";

export type StatusSummary = {
  totalParts: number;
  completedParts: number;
  pendingParts: number;
  evidenceRecorded: number;
  currentPart: string;
  nextPart: string | null;
  parts: Array<{
    partNumber: number;
    scenarioId: string;
    outcome: string;
    path: string;
    status: "pending" | "complete";
    evidence: "pending" | "recorded";
    phase?: string;
  }>;
  missingEvidence: number[];
  checkedPartsWithoutEvidence: number[];
  evidenceWithoutCheckbox: string[];
};

export async function getStatusSummary(cwd: string): Promise<StatusSummary> {
  const master = await readText(path.join(cwd, "MASTER_PLAN.md"));
  const state = await readText(path.join(cwd, "PLAN_STATE.md"));
  const evidence = await readText(path.join(cwd, "PLAN_EVIDENCE.md"));
  const parts = parseMasterPartStatuses(master);
  const stateParts = parsePartStatuses(state);
  const complete = parts.filter((part) => part.status === "complete").length;
  const pending = parts.length - complete;
  const recordedEvidence = parts.filter((part) => {
    const partLabel = `PART-${String(part.partNumber).padStart(3, "0")}`;
    return part.evidence === "recorded" || hasEvidenceForPart(evidence, partLabel);
  }).length;
  const currentPartPath = parseCurrentPartPath(state) ?? "UNKNOWN";

  const checkedWithoutEvidence = parts.filter((part) => {
    const partLabel = `PART-${String(part.partNumber).padStart(3, "0")}`;
    return part.status === "complete" && !hasEvidenceForPart(evidence, partLabel);
  });
  const missingEvidence = parts.filter((part) => {
    const partLabel = `PART-${String(part.partNumber).padStart(3, "0")}`;
    return !hasEvidenceForPart(evidence, partLabel);
  });
  const knownPartIds = new Set(parts.map((part) => `PART-${String(part.partNumber).padStart(3, "0")}`));
  const orphanEvidence = parseEvidencePartIds(evidence).filter((partId) => !knownPartIds.has(partId));

  return {
    totalParts: parts.length,
    completedParts: complete,
    pendingParts: pending,
    evidenceRecorded: recordedEvidence,
    currentPart: currentPartPath,
    nextPart: parts.find((part) => part.status === "pending")?.path ?? null,
    parts: parts.map((part) => {
    const partLabel = `PART-${String(part.partNumber).padStart(3, "0")}`;
    const statePart = stateParts.find((candidate) => candidate.partNumber === part.partNumber);
    const evidenceStatus = hasEvidenceForPart(evidence, partLabel) || statePart?.evidence === "recorded" ? "recorded" : "pending";
      return { ...part, evidence: evidenceStatus };
    }),
    missingEvidence: missingEvidence.map((part) => part.partNumber),
    checkedPartsWithoutEvidence: checkedWithoutEvidence.map((part) => part.partNumber),
    evidenceWithoutCheckbox: orphanEvidence
  };
}

export async function statusCommand(cwd: string, args: string[] = []): Promise<void> {
  const options = parseOptions(args);
  const summary = await getStatusSummary(cwd);
  if (options.values.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  console.log("Plannable status");
  console.log(`Total parts: ${summary.totalParts}`);
  console.log(`Completed: ${summary.completedParts}`);
  console.log(`Pending: ${summary.pendingParts}`);
  console.log(`Evidence recorded: ${summary.evidenceRecorded}`);
  console.log(`Current part: ${summary.currentPart}`);
  console.log("");

  let lastPhase: string | undefined;
  for (const part of summary.parts) {
    if (part.phase && part.phase !== lastPhase) {
      console.log(`${part.phase}:`);
      lastPhase = part.phase;
    }
    const marker = part.status === "complete" ? "x" : " ";
    console.log(`${part.phase ? "  " : ""}[${marker}] Part ${part.partNumber}: ${part.scenarioId} - ${part.outcome} (evidence: ${part.evidence})`);
  }

  if (summary.nextPart) {
    console.log("");
    console.log(`Next: ${summary.nextPart}`);
  }

  console.log("");
  console.log(`Missing evidence: ${summary.missingEvidence.length > 0 ? summary.missingEvidence.map((partNumber) => `Part ${partNumber}`).join(", ") : "none"}`);
  console.log(`Checked parts without evidence: ${summary.checkedPartsWithoutEvidence.length > 0 ? summary.checkedPartsWithoutEvidence.map((partNumber) => `Part ${partNumber}`).join(", ") : "none"}`);
  console.log(`Evidence without checkbox: ${summary.evidenceWithoutCheckbox.length > 0 ? summary.evidenceWithoutCheckbox.join(", ") : "none"}`);

  if (summary.checkedPartsWithoutEvidence.length > 0) {
    console.log("");
    console.log("Warning: checked parts without evidence should be fixed before completion is reported.");
  }
}
