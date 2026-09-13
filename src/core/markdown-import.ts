export type SectionedItems = {
  tasks: string[];
  acceptance: string[];
  verification: string[];
  context: string[];
  stop: string[];
};

function sectionKindFor(heading: string): keyof SectionedItems | undefined {
  const normalized = heading.toLowerCase();
  if (/\b(stop|blockers?)\b/.test(normalized)) return "stop";
  if (/\b(acceptance|criteria|done when|definition of done)\b/.test(normalized)) return "acceptance";
  if (/\b(verification|verify|tests?|testing|checks?|qa)\b/.test(normalized)) return "verification";
  if (
    /\b(context|background|constraints?|stack|conventions?|non[- ]goals?|out[- ]of[- ]scope|exclusions?|risks?|dependencies)\b/.test(
      normalized
    )
  )
    return "context";
  if (/\b(tasks?|steps?|implementation|implement|todo|plan|work)\b/.test(normalized)) return "tasks";
  return undefined;
}

export function extractSectionedItems(input: string): SectionedItems {
  const sections: SectionedItems = { tasks: [], acceptance: [], verification: [], context: [], stop: [] };
  let currentKind: keyof SectionedItems = "tasks";
  let fence: { marker: string; language: string; lines: string[] } | undefined;
  let seenTitle = false;

  for (const rawLine of input.split(/\r?\n/)) {
    const line = rawLine.trim();
    if (fence) {
      const closing = line.match(/^(`{3,}|~{3,})\s*$/)?.[1];
      if (closing && closing[0] === fence.marker[0] && closing.length >= fence.marker.length) {
        // JSON escapes preserve code indentation/newlines without creating plan block delimiters.
        sections[currentKind].push(`code[${fence.language}]: ${JSON.stringify(fence.lines.join("\n"))}`);
        fence = undefined;
      } else {
        fence.lines.push(rawLine);
      }
      continue;
    }
    const item = line.replace(/^(?:[-*+]|\d+[.)])\s+/, "");
    const opening = item.match(/^(`{3,}|~{3,})(.*)$/);
    if (opening) {
      fence = {
        marker: opening[1],
        language: opening[2].trim().replaceAll("[", "").replaceAll("]", "") || "text",
        lines: []
      };
      continue;
    }
    if (/^#\s+/.test(line) && !seenTitle) {
      seenTitle = true;
      continue;
    }
    const heading = line.match(/^#{1,6}\s+(.+)$/)?.[1];
    if (heading) {
      const kind = sectionKindFor(heading);
      if (kind) currentKind = kind;
      else sections[currentKind].push(`section: ${heading}`);
      continue;
    }
    if (item) sections[currentKind].push(item);
  }
  if (fence) throw new Error("Unclosed code fence in source plan; close it before compressing.");
  return sections;
}
