import path from "node:path";
import { pathExists, readText } from "../core/filesystem.js";
import { hasEvidenceForPart, parseEvidencePartIds } from "../core/evidence.js";
import { parseMasterPartStatuses } from "../core/master-plan.js";
import { parseOptions } from "../core/options.js";
import { parsePlanSummary, validatePlannablePlan } from "../core/plannable-plan.js";
import { findGenericPlanMarkers } from "../core/templates.js";
import { parseCurrentPartPath, parsePartStatuses } from "../core/state.js";

type Check = {
  ok: boolean;
  message: string;
};

export type VerifySummary = {
  ok: boolean;
  failedCount: number;
  checks: Check[];
  warnings: string[];
};

export async function getVerifySummary(cwd: string): Promise<VerifySummary> {
  const checks: Check[] = [];
  const warnings: string[] = [];
  const required = ["MASTER_PLAN.md", "PLAN_STATE.md", "PLAN_EVIDENCE.md", "plans"];

  for (const item of required) {
    checks.push({
      ok: await pathExists(path.join(cwd, item)),
      message: `${item} exists`
    });
  }

  const statePath = path.join(cwd, "PLAN_STATE.md");
  if (!await pathExists(statePath)) {
    const failedCount = checks.filter((check) => !check.ok).length;
    return { ok: false, failedCount, checks, warnings };
  }

  const masterPath = path.join(cwd, "MASTER_PLAN.md");
  const evidencePath = path.join(cwd, "PLAN_EVIDENCE.md");
  const state = await readText(statePath);
  const master = await pathExists(masterPath) ? await readText(masterPath) : "";
  const evidence = await pathExists(evidencePath) ? await readText(evidencePath) : "";
  const parts = parseMasterPartStatuses(master);
  const stateParts = parsePartStatuses(state);
  const nextUnchecked = parts.find((part) => part.status === "pending");
  const currentPartPath = parseCurrentPartPath(state);

  checks.push({
    ok: parts.length > 0,
    message: "MASTER_PLAN.md contains at least one part"
  });
  checks.push({
    ok: stateParts.length === parts.length,
    message: "PLAN_STATE.md part count matches MASTER_PLAN.md"
  });
  checks.push({
    ok: /^## Evidence Log/m.test(evidence),
    message: "PLAN_EVIDENCE.md contains an Evidence Log section"
  });
  checks.push({
    ok: currentPartPath === (nextUnchecked?.path ?? "COMPLETE"),
    message: "PLAN_STATE.md current part matches next unchecked part"
  });

  for (const part of parts) {
    const partPath = path.join(cwd, part.path);
    const exists = await pathExists(partPath);
    checks.push({ ok: exists, message: `${part.path} exists` });

    if (exists) {
      const content = await readText(partPath);
      const summary = parsePlanSummary(content);
      const validation = validatePlannablePlan(content);
      checks.push({
        ok: validation.ok,
        message: `${part.path} has valid PlannablePlan structure`
      });
      checks.push({
        ok: summary.id === `PART-${String(part.partNumber).padStart(3, "0")}`,
        message: `${part.path} has matching ID`
      });
      checks.push({
        ok: summary.scenarioId === part.scenarioId,
        message: `${part.path} has matching SCN`
      });
      checks.push({
        ok: Boolean(summary.outcome),
        message: `${part.path} has OUT`
      });
      for (const error of validation.errors) {
        checks.push({
          ok: false,
          message: `${part.path}: ${error}`
        });
      }
      for (const warning of validation.warnings) {
        warnings.push(`${part.path}: ${warning}`);
      }
      for (const marker of findGenericPlanMarkers(content)) {
        warnings.push(`${part.path}: contains generic draft wording "${marker}" — enrich with product-specific scenarios before implementing.`);
      }
    }

    const masterStatus = masterPartStatus(master, part.partNumber);
    if (masterStatus) {
      checks.push({
        ok: masterStatus === part.status,
        message: `MASTER_PLAN.md checkbox matches PLAN_STATE.md for Part ${part.partNumber}`
      });
    }

    if (part.status === "complete") {
      const partLabel = `PART-${String(part.partNumber).padStart(3, "0")}`;
      checks.push({
        ok: hasEvidenceForPart(evidence, partLabel),
        message: `completed Part ${part.partNumber} has recorded evidence`
      });
    }
  }

  const knownPartIds = new Set(parts.map((part) => `PART-${String(part.partNumber).padStart(3, "0")}`));
  for (const evidencePartId of parseEvidencePartIds(evidence)) {
    checks.push({
      ok: knownPartIds.has(evidencePartId),
      message: `evidence ${evidencePartId} references a real part`
    });
  }

  for (const marker of findGenericPlanMarkers(master)) {
    warnings.push(`MASTER_PLAN.md: contains generic draft wording "${marker}" — enrich with product-specific scenarios before implementing.`);
  }

  const failed = checks.filter((check) => !check.ok);
  return { ok: failed.length === 0, failedCount: failed.length, checks, warnings };
}

export async function verifyCommand(cwd: string, args: string[] = []): Promise<void> {
  const options = parseOptions(args);
  const summary = await getVerifySummary(cwd);
  if (options.values.json) {
    console.log(JSON.stringify(summary, null, 2));
    if (!summary.ok) {
      process.exitCode = 1;
    }
    return;
  }

  printChecks(summary.checks);

  for (const warning of summary.warnings) {
    console.log(`WARN ${warning}`);
  }

  if (!summary.ok) {
    throw new Error(`Plannable verification failed: ${summary.failedCount} issue(s).`);
  }

  console.log("");
  console.log("Plannable verification passed.");
}

function printChecks(checks: Check[]): void {
  for (const check of checks) {
    console.log(`${check.ok ? "OK" : "FAIL"} ${check.message}`);
  }
}

function masterPartStatus(masterContent: string, partNumber: number): "pending" | "complete" | undefined {
  const match = masterContent.match(new RegExp(`^- \\[( |x|X)\\] Part ${partNumber}:`, "m"));
  if (!match) {
    return undefined;
  }

  return match[1].toLowerCase() === "x" ? "complete" : "pending";
}
