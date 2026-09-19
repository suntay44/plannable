import { readTemplate } from "../filesystem.js";
import { FEATURES, type GuidanceModule } from "./types.js";

export const MODULES = ["baseline", "access", "data", "input", "services", "quality"] as const;
const singleLine = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0 && !/[\r\n]/.test(value);

export function validateModules(value: unknown): asserts value is GuidanceModule[] {
  if (!Array.isArray(value) || value.length === 0) throw new Error("Guidance library must contain modules.");
  const ids = new Set<string>();
  const ruleIds = new Set<string>();
  for (const module of value) {
    if (!module || !singleLine(module.id) || !/^[a-z][a-z-]*$/.test(module.id) || ids.has(module.id))
      throw new Error("Invalid or duplicate guidance module ID.");
    ids.add(module.id);
    if (!Number.isInteger(module.revision) || module.revision < 1 || !/^\d{4}-\d{2}-\d{2}$/.test(module.reviewed))
      throw new Error(`Invalid guidance revision/review date: ${module.id}`);
    if (
      !Array.isArray(module.sources) ||
      module.sources.length === 0 ||
      !module.sources.every((source: unknown) => singleLine(source) && /^https:\/\/[^\s]+$/.test(source))
    )
      throw new Error(`Missing HTTPS guidance sources: ${module.id}`);
    if (!Array.isArray(module.rules) || module.rules.length === 0)
      throw new Error(`Missing guidance rules: ${module.id}`);
    for (const rule of module.rules) {
      if (
        !rule ||
        !singleLine(rule.id) ||
        !new RegExp(`^${module.id}\\.[a-z][a-z-]*$`).test(rule.id) ||
        ruleIds.has(rule.id)
      )
        throw new Error(`Invalid or duplicate guidance rule ID: ${module.id}`);
      ruleIds.add(rule.id);
      if (rule.when !== "always" && !FEATURES.includes(rule.when))
        throw new Error(`Unknown guidance condition: ${rule.id}`);
      for (const field of ["constraint", "task", "acceptance", "verification"] as const)
        if (!singleLine(rule[field])) throw new Error(`Missing or multiline ${field}: ${rule.id}`);
    }
  }
}

export async function loadGuidance(): Promise<GuidanceModule[]> {
  const modules: unknown = await Promise.all(
    MODULES.map(async (id) => JSON.parse(await readTemplate(`guidance/${id}.json`)))
  );
  validateModules(modules);
  return modules;
}
