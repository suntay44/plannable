import { FEATURES, type Facts, type GuidanceModule, type Selection } from "./types.js";

const decisions = {
  dependencies: "Inspect dependency versions and project update conventions.",
  privateData: "Confirm who may see or change private records; do not expose them while ownership is unresolved.",
  accounts: "Inspect existing sign-in; ask who needs an account only if product intent is unknown.",
  browserSession: "Inspect the actual session mechanism before choosing session/CSRF protections.",
  externalInput: "Inspect input boundaries and existing validation before implementation.",
  files: "Inspect supported file/path operations and their intended limits.",
  outboundUrls: "Inspect allowed outbound destinations; do not assume arbitrary URLs are permitted.",
  storedData: "Confirm necessary stored data and deletion/recovery expectations; do not invent retention periods.",
  integrations: "Inspect the selected provider; resolve provider/cost decisions without inventing an integration.",
  incomingEvents: "Inspect whether provider callbacks exist before planning event authenticity and duplicate checks.",
  publicService: "Confirm intended public exposure and resource limits before publishing.",
  ui: "Inspect actual UI flows and existing accessibility conventions."
};

export function selectGuidance(modules: GuidanceModule[], facts: Facts = {}): Selection {
  const rules = modules.flatMap((module) =>
    module.rules.flatMap((rule) => {
      const fact = rule.when === "always" ? undefined : facts[rule.when];
      if (rule.when !== "always" && (!fact || fact.value !== true || fact.source === "inferred" || !fact.reason.trim()))
        return [];
      return [{ ...rule, module: module.id, revision: module.revision, reason: fact?.reason ?? "routine default" }];
    })
  );
  return {
    rules,
    decisions: FEATURES.filter((feature) => {
      const fact = facts[feature];
      return fact && (fact.value === "unknown" || fact.source === "inferred" || !fact.reason.trim());
    }).map((feature) => `${feature}: ${decisions[feature]}`)
  };
}
