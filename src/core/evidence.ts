export type EvidenceEntry = {
  partId: string;
  summary: string;
  artifacts: string[];
};

export function hasEvidenceForPart(evidenceContent: string, partLabel: string): boolean {
  return evidenceSectionsForPart(evidenceContent, partLabel).some((section) => {
    const hasSummary = section.summary.some((line) => line.trim().length > 0);
    const hasCompletedArtifact = section.artifacts.some((artifact) => {
      const normalized = artifact.trim().toLowerCase();
      return normalized.length > 0 && normalized !== "manual verification pending";
    });
    return hasSummary && hasCompletedArtifact;
  });
}

export function parseEvidencePartIds(evidenceContent: string): string[] {
  return [...evidenceContent.matchAll(/^###\s+(PART-\d{3})\b/gim)].map((match) => match[1].toUpperCase());
}

export function appendEvidence(content: string, entry: EvidenceEntry): string {
  const summary = entry.summary.trim();
  const artifacts = entry.artifacts.map((artifact) => artifact.trim()).filter(Boolean);
  if (!summary) {
    throw new Error("Evidence requires a non-empty summary.");
  }
  if (artifacts.length === 0) {
    throw new Error('Evidence requires at least one --artifact, --file, --check, --note, or --unavailable "reason".');
  }
  if (artifacts.some((artifact) => artifact.toLowerCase() === "manual verification pending")) {
    throw new Error(
      'Pending manual verification is not completion evidence. Use --unavailable "reason" when a check cannot run.'
    );
  }

  const artifactLines = artifacts.map((artifact) => `- ${artifact}`).join("\n");

  const nextEntry = [`### ${entry.partId}`, "", summary, "", "Artifacts:", artifactLines].join("\n");

  const placeholder = /^[_*]*No evidence recorded( yet)?\.?[_*]*[ \t]*$/im;
  if (placeholder.test(content)) {
    return content.replace(placeholder, nextEntry);
  }

  return `${content.trimEnd()}\n\n${nextEntry}\n`;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

type EvidenceSection = {
  summary: string[];
  artifacts: string[];
};

function evidenceSectionsForPart(evidenceContent: string, partLabel: string): EvidenceSection[] {
  const lines = evidenceContent.split(/\r?\n/);
  const heading = new RegExp(`^###\\s+${escapeRegExp(partLabel)}\\b`, "i");
  const sections: EvidenceSection[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    if (!heading.test(lines[index])) {
      continue;
    }

    const summary: string[] = [];
    const artifacts: string[] = [];
    let inArtifacts = false;
    for (const line of lines.slice(index + 1)) {
      if (/^###\s+/.test(line)) {
        break;
      }
      const trimmed = line.trim();
      if (/^Artifacts:\s*$/i.test(trimmed)) {
        inArtifacts = true;
        continue;
      }
      if (!trimmed) {
        continue;
      }
      if (inArtifacts) {
        artifacts.push(trimmed.replace(/^-\s*/, ""));
      } else {
        summary.push(trimmed);
      }
    }
    sections.push({ summary, artifacts });
  }

  return sections;
}
