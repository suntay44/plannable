import { pathExists, readProjectText, resolveProjectPath } from "../core/filesystem.js";
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
      ok: await pathExists(resolveProjectPath(cwd, item)),
      message: `${item} exists`
    });
  }

  const statePath = resolveProjectPath(cwd, "PLAN_STATE.md");
  if (!(await pathExists(statePath))) {
    const failedCount = checks.filter((check) => !check.ok).length;
    return { ok: false, failedCount, checks, warnings };
  }

  const masterPath = resolveProjectPath(cwd, "MASTER_PLAN.md");
  const evidencePath = resolveProjectPath(cwd, "PLAN_EVIDENCE.md");
  const state = await readProjectText(cwd, "PLAN_STATE.md");
  const master = (await pathExists(masterPath)) ? await readProjectText(cwd, "MASTER_PLAN.md") : "";
  const evidence = (await pathExists(evidencePath)) ? await readProjectText(cwd, "PLAN_EVIDENCE.md") : "";
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
    let content: string | undefined;
    try {
      content = await readProjectText(cwd, part.path);
      checks.push({ ok: true, message: `${part.path} exists inside the project` });
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      checks.push({ ok: false, message: `${part.path} is a readable project file: ${message}` });
    }

    if (content !== undefined) {
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
        warnings.push(
          `${part.path}: contains generic draft wording "${marker}" — enrich with product-specific scenarios before implementing.`
        );
      }
    }

    const statePart = stateParts.find((candidate) => candidate.partNumber === part.partNumber);
    checks.push({
      ok: Boolean(statePart),
      message: `PLAN_STATE.md contains Part ${part.partNumber}`
    });
    if (statePart) {
      checks.push({
        ok: statePart.status === part.status,
        message: `MASTER_PLAN.md checkbox matches PLAN_STATE.md for Part ${part.partNumber}`
      });
      checks.push({
        ok: statePart.path === part.path,
        message: `MASTER_PLAN.md path matches PLAN_STATE.md for Part ${part.partNumber}`
      });
      checks.push({
        ok: statePart.scenarioId === part.scenarioId,
        message: `MASTER_PLAN.md scenario matches PLAN_STATE.md for Part ${part.partNumber}`
      });
      checks.push({
        ok: statePart.outcome === part.outcome,
        message: `MASTER_PLAN.md outcome matches PLAN_STATE.md for Part ${part.partNumber}`
      });
    }

    const partLabel = `PART-${String(part.partNumber).padStart(3, "0")}`;
    const evidenceExists = hasEvidenceForPart(evidence, partLabel);
    checks.push({
      ok: part.evidence === (evidenceExists ? "recorded" : "pending"),
      message: `MASTER_PLAN.md evidence marker matches PLAN_EVIDENCE.md for Part ${part.partNumber}`
    });
    if (statePart) {
      checks.push({
        ok: statePart.evidence === (evidenceExists ? "recorded" : "pending"),
        message: `PLAN_STATE.md evidence marker matches PLAN_EVIDENCE.md for Part ${part.partNumber}`
      });
    }

    if (part.status === "complete") {
      checks.push({
        ok: evidenceExists,
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
    warnings.push(
      `MASTER_PLAN.md: contains generic draft wording "${marker}" — enrich with product-specific scenarios before implementing.`
    );
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

  const verbose = Boolean(options.values.verbose);
  printChecks(summary.checks, verbose);

  for (const warning of summary.warnings) {
    console.log(`WARN ${warning}`);
  }

  const passedCount = summary.checks.length - summary.failedCount;
  console.log(
    `${passedCount} check(s) passed, ${summary.failedCount} failed.${verbose ? "" : " Use --verbose to list every check."}`
  );

  if (!summary.ok) {
    throw new Error(`Plannable verification failed: ${summary.failedCount} issue(s).`);
  }

  console.log("");
  console.log("Plannable verification passed.");
}

function printChecks(checks: Check[], verbose: boolean): void {
  for (const check of checks) {
    if (verbose || !check.ok) {
      console.log(`${check.ok ? "OK" : "FAIL"} ${check.message}`);
    }
  }
}
