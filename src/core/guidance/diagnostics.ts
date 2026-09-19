const idPattern = "[a-z][a-z-]*\\.[a-z][a-z-]*";

export function guidanceWarnings(blocks: Record<string, string[]>): string[] {
  const context = blocks.CTX.join("\n");
  const markers = blocks.CTX.filter((line) => /^- guidance:/.test(line));
  const tags = [
    ...["C", "T", "AC", "V"].flatMap((block) =>
      [...blocks[block].join("\n").matchAll(new RegExp(`\\[(${idPattern})\\]`, "g"))].map((match) => match[1])
    )
  ];
  if (!markers.length) return tags.length ? ["Guidance tags have no expected-rule marker; review coverage."] : [];
  const match = markers[0].match(
    new RegExp(`^- guidance: v1; rules=(${idPattern}@[1-9]\\d*(?:,${idPattern}@[1-9]\\d*)*)$`)
  );
  if (markers.length !== 1 || !match) return ["Malformed or unsupported guidance marker; review coverage."];
  const expected = match[1].split(",").map((entry) => entry.split("@")[0]);
  const warnings: string[] = [];
  if (new Set(expected).size !== expected.length) warnings.push("Duplicate expected guidance rule IDs.");
  for (const id of new Set(expected)) {
    const basis = blocks.CTX.find((line) => line.startsWith(`- basis[${id}]:`));
    if (!basis?.slice(basis.indexOf(":") + 1).trim() || basis.endsWith(': ""'))
      warnings.push(`Guidance ${id}: missing applicability basis.`);
    for (const block of ["C", "T", "AC", "V"]) {
      const tagged = blocks[block].filter((line) => line.includes(`[${id}]`));
      if (!tagged.some((line) => line.slice(line.indexOf(`[${id}]`) + id.length + 2).trim()))
        warnings.push(`Guidance ${id}: missing actionable ${block} mapping.`);
    }
  }
  for (const id of new Set(tags))
    if (!expected.includes(id)) warnings.push(`Guidance ${id}: not listed in expected rules.`);
  if (/^- decision\[/m.test(context))
    warnings.push("Guidance has unresolved decisions; inspect them before affected work.");
  return warnings;
}
