export type EvidenceEntry = {
  partId: string;
  summary: string;
  artifacts: string[];
};

export function hasEvidenceForPart(evidenceContent: string, partLabel: string): boolean {
  return new RegExp(`(^|\\n)###\\s+${escapeRegExp(partLabel)}\\b`, "i").test(evidenceContent);
}

export function parseEvidencePartIds(evidenceContent: string): string[] {
  return [...evidenceContent.matchAll(/^###\s+(PART-\d{3})\b/gim)].map((match) => match[1].toUpperCase());
}

export function appendEvidence(content: string, entry: EvidenceEntry): string {
  const artifactLines = entry.artifacts.length > 0
    ? entry.artifacts.map((artifact) => `- ${artifact}`).join("\n")
    : "- Manual verification pending";

  const nextEntry = [
    `### ${entry.partId}`,
    "",
    entry.summary,
    "",
    "Artifacts:",
    artifactLines
  ].join("\n");

  const placeholder = /^[_*]*No evidence recorded( yet)?\.?[_*]*[ \t]*$/im;
  if (placeholder.test(content)) {
    return content.replace(placeholder, nextEntry);
  }

  return `${content.trimEnd()}\n\n${nextEntry}\n`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
