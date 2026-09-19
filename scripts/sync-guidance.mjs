import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { loadGuidance } from "../dist/core/guidance/catalog.js";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const modules = await loadGuidance();
const overview = [
  "# Planning safeguards",
  "",
  "Generated from templates/guidance; edit the source, not this mirror.",
  "",
  "Handle routine safeguards without asking whether they are wanted. Inspect technical facts first; ask only unresolved product choices (access, sharing, retention, exposure, cost). Not sure is not approval for risky work.",
  "",
  "Select applicable baseline rules and quality.change. Reuse current-revision rules already inline; load module text only to add, refresh or resolve a rule. Do not infer scope from the product name or package presence alone. Unknown is not absent. Preserve explicit exclusions and existing behavior.",
  "",
  ...modules.map(
    (module) =>
      `- [${module.id}](./${module.id}.md): ${module.rules.map((rule) => `${rule.id} (${rule.when})`).join(", ")}`
  ),
  "",
  "## Existing v0.1 blocks",
  "",
  "CTX: - guidance: v1; rules=baseline.secrets@1,quality.change@1",
  "CTX: - basis[baseline.secrets]: routine default",
  "Add basis for each rule and [rule.id] text in C, T, AC, V. Keep required actions inline; IDs alone are insufficient. For uncertain context, CTX: - decision[feature]: inspect or ask; add the relevant S stop condition.",
  "",
  "Before coding, match applicable IDs to constraints/actions and positive/negative acceptance/checks. Reassess on scope changes; keep later implications in MASTER_PLAN without loading all parts. Resolve risky unknowns before affected work, preserving part order.",
  "",
  "Evidence: rule ID; changed path; actual command/manual check; observed result; artifact; limits. Planned, implemented, passed and unavailable differ. Never label unavailable checks passed. verify/complete check plan structure/evidence presence, not application security. Explain planned safeguards, passed checks and unresolved items briefly to the owner.",
  ""
].join("\n");
const files = new Map([["guidance.md", overview]]);
for (const module of modules) {
  files.set(
    `${module.id}.md`,
    [
      `# ${module.id} guidance (revision ${module.revision})`,
      "",
      `Reviewed: ${module.reviewed}. Sources inform original guidance; no certification is implied.`,
      "",
      ...module.rules.flatMap((rule) => [
        `## ${rule.id}`,
        `Applies: ${rule.when === "always" ? "every active part" : `only when ${rule.when} is confirmed`}. Otherwise inspect uncertain scope; do not introduce the feature.`,
        `C: [${rule.id}] ${rule.constraint}`,
        `T: [${rule.id}] ${rule.task}`,
        `AC: [${rule.id}] ${rule.acceptance}`,
        `V: [${rule.id}] ${rule.verification}`,
        ""
      ]),
      "Sources:",
      ...module.sources.map((url) => `- ${url}`),
      ""
    ].join("\n")
  );
}
for (const platform of [".agents", ".codex", ".claude", ".cursor"]) {
  const dir = path.join(root, platform, "skills/plannable/references");
  for (const [name, content] of files) {
    const target = path.join(dir, name);
    if (process.argv.includes("--check")) {
      if ((await readFile(target, "utf8").catch(() => "")) !== content)
        throw new Error(`Guidance mirror is stale: ${platform}/${name}. Run npm run guidance:sync.`);
    } else {
      await mkdir(dir, { recursive: true });
      await writeFile(target, content);
    }
  }
}
