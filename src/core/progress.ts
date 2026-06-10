import { hasEvidenceForPart } from "./evidence.js";
import { parseMasterPartStatuses } from "./master-plan.js";
import { type PartStatus } from "./state.js";

export function normalizePartId(value: string): string {
  const trimmed = value.trim().toUpperCase();
  const partMatch = trimmed.match(/^PART-(\d+)$/);
  if (partMatch) {
    return `PART-${partMatch[1].padStart(3, "0")}`;
  }

  const shortMatch = trimmed.match(/^P(\d+)$/);
  if (shortMatch) {
    return `PART-${shortMatch[1].padStart(3, "0")}`;
  }

  throw new Error(`Invalid part id: ${value}. Use PART-001 or P1.`);
}

export function partNumberFromId(partId: string): number {
  return Number(normalizePartId(partId).replace("PART-", ""));
}

export function partIdFromNumber(partNumber: number): string {
  return `PART-${String(partNumber).padStart(3, "0")}`;
}

export function findPartById(masterContent: string, partId: string): PartStatus {
  const partNumber = partNumberFromId(partId);
  const part = parseMasterPartStatuses(masterContent).find((candidate) => candidate.partNumber === partNumber);
  if (!part) {
    throw new Error(`Part ${normalizePartId(partId)} is not listed in MASTER_PLAN.md.`);
  }

  return part;
}

export function markPartCompleteInMaster(masterContent: string, partId: string): string {
  const partNumber = partNumberFromId(partId);
  const lines = masterContent.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    if (new RegExp(`^- \\[( |x|X)\\] Part ${partNumber}:`).test(lines[index])) {
      lines[index] = lines[index].replace(/^- \[( |x|X)\]/, "- [x]");
      if (lines[index + 3]?.match(/Evidence:\s*(recorded|pending)/i)) {
        lines[index + 3] = lines[index + 3].replace(/Evidence:\s*(recorded|pending)/i, "Evidence: recorded");
      }
      return lines.join("\n");
    }
  }

  throw new Error(`Part ${partIdFromNumber(partNumber)} is not listed in MASTER_PLAN.md.`);
}

export function markEvidenceRecordedInMaster(masterContent: string, partNumber: number): string {
  const lines = masterContent.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (new RegExp(`^- \\[( |x|X)\\] Part ${partNumber}:`).test(lines[index])) {
      for (let offset = 1; offset <= 4; offset += 1) {
        if (lines[index + offset]?.match(/Evidence:\s*(recorded|pending)/i)) {
          lines[index + offset] = lines[index + offset].replace(/Evidence:\s*(recorded|pending)/i, "Evidence: recorded");
          return lines.join("\n");
        }
      }
    }
  }

  return masterContent;
}

export function assertPartHasEvidence(evidenceContent: string, partId: string): void {
  const normalized = normalizePartId(partId);
  if (!hasEvidenceForPart(evidenceContent, normalized)) {
    throw new Error(`Part ${normalized} has no evidence. Run plannable evidence ${normalized} "summary" first, or pass --summary to plannable complete.`);
  }
}

