import { lstat } from "node:fs/promises";
import path from "node:path";
import type { Facts, Selection } from "./guidance/types.js";
import { readProjectText } from "./filesystem.js";

export type ProjectContext = { files: string[]; verification: string[]; facts?: Facts; guidance?: Selection };
export const UNKNOWN_CHECKS = ["Identify and run project-specific checks; record unavailable checks."];

export async function detectProjectContext(cwd: string): Promise<ProjectContext> {
  const files: string[] = [];
  for (const name of ["src", "app", "components", "tests", "docs"]) {
    try {
      if ((await lstat(path.join(cwd, name))).isDirectory()) files.push(`? ${name}/`);
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
    }
  }
  const context: ProjectContext = {
    files: files.length ? files : ["? identify files for this part"],
    verification: UNKNOWN_CHECKS
  };
  let raw: string;
  try {
    raw = await readProjectText(cwd, "package.json");
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return context;
    throw error;
  }
  let manifest: {
    scripts?: Record<string, unknown>;
    packageManager?: unknown;
    dependencies?: unknown;
    devDependencies?: unknown;
  } | null;
  try {
    manifest = JSON.parse(raw) as typeof manifest;
  } catch {
    throw new Error("Cannot detect project checks: package.json is not valid JSON.");
  }
  if (
    manifest &&
    typeof manifest === "object" &&
    [manifest.dependencies, manifest.devDependencies].some(
      (value) => value && typeof value === "object" && !Array.isArray(value) && Object.keys(value).length > 0
    )
  )
    context.facts = { dependencies: { value: true, source: "observed", reason: "package.json declares dependencies" } };
  if (!manifest || typeof manifest !== "object" || !manifest.scripts || typeof manifest.scripts !== "object")
    return context;

  // Trust an explicit declaration. Conflicting lockfiles require human resolution.
  let manager: string | undefined;
  if (typeof manifest.packageManager === "string") {
    manager = manifest.packageManager.match(/^(npm|pnpm|yarn|bun)@[^\s]+$/)?.[1];
  } else if (manifest.packageManager === undefined) {
    const detected = new Set<string>();
    for (const [file, name] of [
      ["package-lock.json", "npm"],
      ["npm-shrinkwrap.json", "npm"],
      ["pnpm-lock.yaml", "pnpm"],
      ["yarn.lock", "yarn"],
      ["bun.lock", "bun"],
      ["bun.lockb", "bun"]
    ]) {
      try {
        if ((await lstat(path.join(cwd, file))).isFile()) detected.add(name);
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error;
      }
    }
    manager = detected.size === 0 ? "npm" : detected.size === 1 ? [...detected][0] : undefined;
  }
  if (!manager) return context;
  const verification = ["typecheck", "lint", "test", "build"]
    .filter((name) => typeof manifest.scripts?.[name] === "string" && (manifest.scripts[name] as string).trim())
    .map((name) => `${manager} run ${name}`);
  return { ...context, verification: verification.length ? verification : UNKNOWN_CHECKS };
}
