import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { beforeAll, describe, expect, it } from "vitest";
import { parseMasterPartStatuses } from "../src/core/master-plan.ts";
import { parsePlannablePlan, validatePlannablePlan } from "../src/core/plannable-plan.ts";

const execFileAsync = promisify(execFile);
const repoRoot = process.cwd();
const cliPath = path.join(repoRoot, "dist", "cli.js");

beforeAll(async () => {
  await execFileAsync("npm", ["run", "build"], { cwd: repoRoot });
});

async function withTempDir<T>(fn: (dir: string) => Promise<T>): Promise<T> {
  const dir = await mkdtemp(path.join(tmpdir(), "plannable-test-"));
  try {
    return await fn(dir);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
}

async function runPlannable(cwd: string, args: string[]) {
  return execFileAsync("node", [cliPath, ...args], { cwd });
}

describe("Plannable CLI", () => {
  it("create, status, verify, and run-next use symbolic PlannablePlan files", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "CRM"]);

      const master = await readFile(path.join(dir, "MASTER_PLAN.md"), "utf8");
      const parts = parseMasterPartStatuses(master);
      expect(parts).toHaveLength(3);
      expect(parts[0].scenarioId).toBe("SCN-001");

      const part = await readFile(path.join(dir, "plans", "PART1_PLAN.ai.md"), "utf8");
      expect(part).toMatch(/^@PlannablePlan v0\.1/m);
      expect(part).toMatch(/^ID=PART-001/m);
      expect(part).toMatch(/^SCN=SCN-001/m);
      expect(validatePlannablePlan(part).ok).toBe(true);

      const status = await runPlannable(dir, ["status"]);
      expect(status.stdout).toMatch(/Total parts: 3/);
      expect(status.stdout).toMatch(/Completed: 0/);

      const verify = await runPlannable(dir, ["verify"]);
      expect(verify.stdout).toMatch(/Plannable verification passed/);

      const next = await runPlannable(dir, ["run-next"]);
      expect(next.stdout).toMatch(/Next part: P1/);
      expect(next.stdout).toMatch(/Load only: plans\/PART1_PLAN\.ai\.md/);
      expect(next.stdout).toMatch(/^T:/m);
    });
  });

  it("create supports scenario hints and arbitrary software plans with three parts", async () => {
    await withTempDir(async (dir) => {
      for (const product of ["CRM", "TODO app", "restaurant homepage", "inventory management app", "SaaS billing dashboard", "mobile habit tracker", "backend API"]) {
        const productDir = path.join(dir, product.replace(/\s+/g, "-"));
        await mkdir(productDir);
        await runPlannable(productDir, ["create", product]);
        const master = await readFile(path.join(productDir, "MASTER_PLAN.md"), "utf8");
        expect(parseMasterPartStatuses(master)).toHaveLength(3);
      }

      const inventoryMaster = await readFile(path.join(dir, "inventory-management-app", "MASTER_PLAN.md"), "utf8");
      expect(inventoryMaster).toMatch(/User creates an inventory item/);
      expect(inventoryMaster).toMatch(/Inventory Item management works/);

      const billingMaster = await readFile(path.join(dir, "SaaS-billing-dashboard", "MASTER_PLAN.md"), "utf8");
      expect(billingMaster).toMatch(/Operator views billing health/);

      const mobileMaster = await readFile(path.join(dir, "mobile-habit-tracker", "MASTER_PLAN.md"), "utf8");
      expect(mobileMaster).toMatch(/User completes onboarding/);

      const apiMaster = await readFile(path.join(dir, "backend-API", "MASTER_PLAN.md"), "utf8");
      expect(apiMaster).toMatch(/Client creates a resource/);
    });
  });

  it("expand summarizes symbolic PlannablePlan content", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "TODO app"]);

      const result = await runPlannable(dir, ["expand", "plans/PART1_PLAN.ai.md"]);
      expect(result.stdout).toMatch(/# PART-001/);
      expect(result.stdout).toMatch(/Scenario: SCN-001/);
      expect(result.stdout).toMatch(/## Acceptance Criteria/);
    });
  });

  it("compress converts a markdown task file into a .ai.md file", async () => {
    await withTempDir(async (dir) => {
      await writeFile(path.join(dir, "plan.md"), "# Import Contacts\n\n- Create import form\n- Validate CSV rows\n", "utf8");

      const result = await runPlannable(dir, ["compress", "plan.md"]);
      expect(result.stdout).toMatch(/Tokens \(est\.\): input ~\d+ -> output ~\d+/);

      const compressed = await readFile(path.join(dir, "plan.ai.md"), "utf8");
      expect(compressed).toMatch(/^@PlannablePlan v0\.1/m);
      expect(compressed).toMatch(/^OUT=Import Contacts implementation slice works/m);
      expect(compressed).toMatch(/1 Create import form/);
      expect(compressed).toMatch(/^CTX:/m);
      expect(parsePlannablePlan(compressed).acceptanceCriteria).toHaveLength(2);
    });
  });

  it("compress maps numbered lists and known sections into the right blocks", async () => {
    await withTempDir(async (dir) => {
      const source = [
        "# Search Feature",
        "",
        "## Tasks",
        "1. Build search index",
        "2) Add search endpoint",
        "",
        "## Acceptance Criteria",
        "- Search returns relevant results",
        "",
        "## Verification",
        "- npm test",
        "",
        "## Constraints",
        "- Postgres full-text search only"
      ].join("\n");
      await writeFile(path.join(dir, "search.md"), source, "utf8");

      await runPlannable(dir, ["compress", "search.md"]);

      const parsed = parsePlannablePlan(await readFile(path.join(dir, "search.ai.md"), "utf8"));
      expect(parsed.tasks).toEqual(["1 Build search index", "2 Add search endpoint"]);
      expect(parsed.acceptanceCriteria).toEqual(["- Search returns relevant results"]);
      expect(parsed.verification).toContain("- npm test?");
      expect(parsed.context.join("\n")).toMatch(/Postgres full-text search only/);
    });
  });

  it("prints a friendly error when no plan exists in the directory", async () => {
    await withTempDir(async (dir) => {
      await expect(runPlannable(dir, ["status"])).rejects.toMatchObject({
        stderr: expect.stringContaining("No Plannable plan found here")
      });
      await expect(runPlannable(dir, ["run-next"])).rejects.toMatchObject({
        stderr: expect.stringContaining('plannable create "<product idea>"')
      });
    });
  });

  it("--version prints the package.json version", async () => {
    await withTempDir(async (dir) => {
      const pkg = JSON.parse(await readFile(path.join(repoRoot, "package.json"), "utf8"));
      const result = await runPlannable(dir, ["--version"]);
      expect(result.stdout.trim()).toBe(pkg.version);
    });
  });

  it("parses hand-written plans with CRLF endings and spaces around field equals", () => {
    const handWritten = [
      "@PlannablePlan v0.1",
      "",
      "ID = PART-001",
      "PH = CORE",
      "SCN = SCN-001",
      "OUT = Login works",
      "",
      "T:",
      "1 build login form",
      "",
      "AC:",
      "- user can log in",
      "",
      "V:",
      "- npm test?",
      "",
      "DONE:",
      "- update MASTER_PLAN.md Part 1=[x]",
      "",
      "S:",
      "- stop if auth provider unclear"
    ].join("\r\n");

    const result = validatePlannablePlan(handWritten);
    expect(result.ok).toBe(true);

    const parsed = parsePlannablePlan(handWritten);
    expect(parsed.id).toBe("PART-001");
    expect(parsed.outcome).toBe("Login works");
    expect(parsed.tasks).toEqual(["1 build login form"]);
  });

  it("parses masterplans with more than nine parts across multiple phases", () => {
    const partBlock = (n: number) => [
      `- [${n <= 4 ? "x" : " "}] Part ${n}: Read \`plans/PART${n}_PLAN.ai.md\``,
      `  - Scenario: SCN-${String(n).padStart(3, "0")}`,
      `  - Outcome: Outcome ${n} works`,
      "  - Evidence: pending"
    ].join("\n");
    const master = [
      "# MASTER_PLAN.md",
      "",
      "## Phase 1: Foundation",
      "",
      ...Array.from({ length: 6 }, (_, i) => partBlock(i + 1)),
      "",
      "## Phase 2: Growth",
      "",
      ...Array.from({ length: 6 }, (_, i) => partBlock(i + 7))
    ].join("\n");

    const parts = parseMasterPartStatuses(master);
    expect(parts).toHaveLength(12);
    expect(parts[11].partNumber).toBe(12);
    expect(parts[0].phase).toBe("Phase 1: Foundation");
    expect(parts[11].phase).toBe("Phase 2: Growth");
    expect(parts.find((part) => part.status === "pending")?.partNumber).toBe(5);
  });

  it("validation detects missing fields, old names, and empty blocks", () => {
    const invalid = [
      "@PlanPack v0.1",
      "",
      "ID=PART-001",
      "AC:",
      "",
      "V:"
    ].join("\n");

    const result = validatePlannablePlan(invalid);
    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Uses old @PlanPack name.");
    expect(result.errors).toContain("Missing @PlannablePlan header.");
    expect(result.errors).toContain("Missing required field: PH");
    expect(result.errors).toContain("Missing or empty T task block.");
  });

  it("verify detects completed parts without evidence", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "CRM"]);

      const masterPath = path.join(dir, "MASTER_PLAN.md");
      const statePath = path.join(dir, "PLAN_STATE.md");
      await writeFile(masterPath, (await readFile(masterPath, "utf8")).replace("- [ ] Part 1:", "- [x] Part 1:"), "utf8");
      await writeFile(statePath, (await readFile(statePath, "utf8")).replace("- [ ] Part 1:", "- [x] Part 1:"), "utf8");

      await expect(runPlannable(dir, ["verify"])).rejects.toMatchObject({
        stderr: expect.stringContaining("Plannable verification failed")
      });
    });
  });

  it("evidence and complete record evidence, check off a part, and advance current part", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "inventory management app"]);

      const evidence = await runPlannable(dir, [
        "evidence",
        "P1",
        "Inventory item creation verified.",
        "--artifact",
        "npm test",
        "--file",
        "src/inventory.ts"
      ]);
      expect(evidence.stdout).toMatch(/Recorded evidence for PART-001/);

      const complete = await runPlannable(dir, ["complete", "PART-001"]);
      expect(complete.stdout).toMatch(/Completed PART-001/);

      const master = await readFile(path.join(dir, "MASTER_PLAN.md"), "utf8");
      const state = await readFile(path.join(dir, "PLAN_STATE.md"), "utf8");
      const evidenceLog = await readFile(path.join(dir, "PLAN_EVIDENCE.md"), "utf8");
      expect(master).toMatch(/- \[x\] Part 1:/);
      expect(master).toMatch(/Evidence: recorded/);
      expect(state).toMatch(/Next: plans\/PART2_PLAN\.ai\.md/);
      expect(evidenceLog).toMatch(/### PART-001/);

      const verify = await runPlannable(dir, ["verify"]);
      expect(verify.stdout).toMatch(/Plannable verification passed/);
    });
  });

  it("complete can add evidence with --summary and doctor verifies health", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "backend API"]);
      await runPlannable(dir, [
        "complete",
        "P1",
        "--summary",
        "Resource creation API verified.",
        "--artifact",
        "npm test"
      ]);

      const doctor = await runPlannable(dir, ["doctor"]);
      expect(doctor.stdout).toMatch(/# Plannable Doctor/);
      expect(doctor.stdout).toMatch(/Plannable verification passed/);
    });
  });

  it("run-next, status, verify, and doctor support json output", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "mobile habit tracker"]);

      const next = JSON.parse((await runPlannable(dir, ["run-next", "--json"])).stdout);
      expect(next.next.scenarioId).toBe("SCN-001");
      expect(next.content).toBeUndefined();

      const status = JSON.parse((await runPlannable(dir, ["status", "--json"])).stdout);
      expect(status.totalParts).toBe(3);
      expect(status.pendingParts).toBe(3);

      const verify = JSON.parse((await runPlannable(dir, ["verify", "--json"])).stdout);
      expect(verify.ok).toBe(true);

      const doctor = JSON.parse((await runPlannable(dir, ["doctor", "--json"])).stdout);
      expect(doctor.status.totalParts).toBe(3);
      expect(doctor.verify.ok).toBe(true);
    });
  });

  it("evidence keeps MASTER_PLAN.md and PLAN_STATE.md in sync without repair", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "backend API"]);
      await runPlannable(dir, ["evidence", "P1", "Resource API verified.", "--artifact", "npm test"]);

      const master = await readFile(path.join(dir, "MASTER_PLAN.md"), "utf8");
      const state = await readFile(path.join(dir, "PLAN_STATE.md"), "utf8");
      expect(master).toMatch(/Evidence: recorded/);
      expect(state).toMatch(/Evidence: recorded/);
    });
  });

  it("repair regenerates PLAN_STATE.md from MASTER_PLAN.md after manual drift", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "backend API"]);
      await runPlannable(dir, ["evidence", "P1", "Resource API verified.", "--artifact", "npm test"]);

      const masterPath = path.join(dir, "MASTER_PLAN.md");
      const statePath = path.join(dir, "PLAN_STATE.md");
      await writeFile(masterPath, (await readFile(masterPath, "utf8")).replace("Evidence: recorded", "Evidence: pending"), "utf8");
      await writeFile(statePath, (await readFile(statePath, "utf8")).replace("Next: plans/PART1_PLAN.ai.md", "Next: plans/PART9_PLAN.ai.md"), "utf8");

      const repair = await runPlannable(dir, ["repair", "--json"]);
      const summary = JSON.parse(repair.stdout);
      expect(summary.changed).toBe(true);
      expect(summary.changes.join("\n")).toMatch(/marked MASTER_PLAN\.md evidence recorded/);
      expect(summary.changes.join("\n")).toMatch(/regenerated PLAN_STATE\.md/);

      const master = await readFile(masterPath, "utf8");
      const state = await readFile(statePath, "utf8");
      expect(master).toMatch(/Evidence: recorded/);
      expect(state).toMatch(/Evidence: recorded/);
      expect(state).toMatch(/Next: plans\/PART1_PLAN\.ai\.md/);
    });
  });

  it("created parts carry compressed CTX phase context", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "CRM"]);

      const part1 = await readFile(path.join(dir, "plans", "PART1_PLAN.ai.md"), "utf8");
      expect(part1).toMatch(/^CTX:/m);
      expect(part1).toMatch(/prior: none — this is the first part/);
      expect(part1).toMatch(/next: PART-002 covers "Deal pipeline works"/);

      const part3 = await readFile(path.join(dir, "plans", "PART3_PLAN.ai.md"), "utf8");
      expect(part3).toMatch(/PART-001 delivered "Contact management works"; PART-002 delivered "Deal pipeline works"/);
      expect(part3).toMatch(/next: COMPLETE — run plannable verify/);
      expect(parsePlannablePlan(part3).context.length).toBeGreaterThan(0);
    });
  });

  it("verify warns about generic draft plans but passes scenario-hinted plans cleanly", async () => {
    await withTempDir(async (dir) => {
      const genericDir = path.join(dir, "generic");
      const crmDir = path.join(dir, "crm");
      await mkdir(genericDir);
      await mkdir(crmDir);

      await runPlannable(genericDir, ["create", "widget studio"]);
      const generic = JSON.parse((await runPlannable(genericDir, ["verify", "--json"])).stdout);
      expect(generic.ok).toBe(true);
      expect(generic.warnings.join("\n")).toMatch(/generic draft wording/);

      await runPlannable(crmDir, ["create", "CRM"]);
      const crm = JSON.parse((await runPlannable(crmDir, ["verify", "--json"])).stdout);
      expect(crm.ok).toBe(true);
      expect(crm.warnings).toHaveLength(0);
    });
  });

  it("status groups parts under their masterplan phase", async () => {
    await withTempDir(async (dir) => {
      await runPlannable(dir, ["create", "CRM"]);

      const status = await runPlannable(dir, ["status"]);
      expect(status.stdout).toMatch(/Phase 1: Core CRM Foundation:/);
      expect(status.stdout).toMatch(/ {2}\[ \] Part 1:/);
    });
  });
});
