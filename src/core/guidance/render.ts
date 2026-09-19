import type { Selection } from "./types.js";

export function renderGuidance(selection?: Selection): Record<string, string> {
  const fields = {
    guidanceContext: "",
    guidanceConstraints: "",
    guidanceTasks: "",
    guidanceAcceptance: "",
    guidanceVerification: "",
    guidanceStops: ""
  };
  if (!selection) return fields;
  const { rules, decisions } = selection;
  fields.guidanceContext = [
    `- guidance: v1; rules=${rules.map((rule) => `${rule.id}@${rule.revision}`).join(",")}`,
    ...rules.map((rule) => `- basis[${rule.id}]: ${JSON.stringify(rule.reason)}`),
    "- scope: inspect features before coding; names/dependencies do not prove security scope.",
    ...decisions.map(
      (decision) =>
        `- decision[${decision.split(":")[0]}]: ${JSON.stringify(decision.slice(decision.indexOf(":") + 2))}`
    )
  ].join("\n");
  for (const [key, field] of [
    ["guidanceConstraints", "constraint"],
    ["guidanceTasks", "task"],
    ["guidanceAcceptance", "acceptance"],
    ["guidanceVerification", "verification"]
  ] as const) {
    fields[key] = rules.map((rule) => `- [${rule.id}] ${rule[field]}`).join("\n");
  }
  fields.guidanceStops = decisions
    .map((decision) => `- Resolve before affected work: ${JSON.stringify(decision)}`)
    .join("\n");
  return Object.fromEntries(Object.entries(fields).map(([key, value]) => [key, value ? `\n${value}` : ""]));
}
