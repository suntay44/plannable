import { readFile } from "node:fs/promises";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseMasterPartStatuses } from "../src/core/master-plan.ts";
import { firstValue, allValues, parseOptions } from "../src/core/options.ts";
import {
  findPartById,
  markPartCompleteInMaster,
  normalizePartId,
  partNumberFromId
} from "../src/core/progress.ts";
import { regenerateState } from "../src/core/state.ts";
import {
  PLANNABLE_PLAN_HEADER,
  compressToPlannablePlan,
  estimateTokens,
  validatePlannablePlan
} from "../src/core/plannable-plan.ts";

const repoRoot = process.cwd();

function sampleMaster(): string {
  return [
    "# MASTER_PLAN.md",
    "",
    "## Phase 1: Core CRM Foundation",
    "",
    "- [ ] Part 1: Read `plans/PART1_PLAN.ai.md`",
    "  - Scenario: SCN-001",
    "  - Outcome: Contact management works",
    "  - Evidence: pending",
    "",
    "- [ ] Part 2: Read `plans/PART2_PLAN.ai.md`",
    "  - Scenario: SCN-002",
    "  - Outcome: Deal pipeline works",
    "  - Evidence: pending"
  ].join("\n");
}

describe("core plan helpers", () => {
  it("normalizes short and long part ids", () => {
    expect(normalizePartId("p1")).toBe("PART-001");
    expect(normalizePartId("PART-12")).toBe("PART-012");
    expect(partNumberFromId("P42")).toBe(42);
    expect(() => normalizePartId("first")).toThrow(/Invalid part id/);
  });

  it("finds and completes parts in MASTER_PLAN.md without changing unrelated parts", () => {
    const master = sampleMaster();

    expect(findPartById(master, "P2")).toMatchObject({
      partNumber: 2,
      path: "plans/PART2_PLAN.ai.md",
      scenarioId: "SCN-002"
    });

    const updated = markPartCompleteInMaster(master, "P1");
    const parts = parseMasterPartStatuses(updated);
    expect(parts[0]).toMatchObject({ status: "complete", evidence: "recorded" });
    expect(parts[1]).toMatchObject({ status: "pending", evidence: "pending" });
  });

  it("regenerates PLAN_STATE.md from master status plus evidence", () => {
    const completedMaster = markPartCompleteInMaster(sampleMaster(), "P1");
    const state = regenerateState(
      [
        "# PLAN_STATE.md",
        "",
        "Project: CRM",
        "Created: 2026-06-11T00:00:00.000Z"
      ].join("\n"),
      parseMasterPartStatuses(completedMaster),
      (partLabel) => partLabel === "PART-002"
    );

    expect(state).toContain("Project: CRM");
    expect(state).toContain("Created: 2026-06-11T00:00:00.000Z");
    expect(state).toContain("Next: plans/PART2_PLAN.ai.md");
    expect(state).toContain("- [x] Part 1: plans/PART1_PLAN.ai.md");
    expect(state).toContain("  - Evidence: recorded");
  });

  it("parses repeated CLI flags and boolean options", () => {
    const options = parseOptions([
      "evidence",
      "P1",
      "--artifact",
      "npm test",
      "--artifact",
      "npm run build",
      "--json"
    ]);

    expect(options.positional).toEqual(["evidence", "P1"]);
    expect(firstValue(options, "artifact")).toBe("npm test");
    expect(allValues(options, "artifact")).toEqual(["npm test", "npm run build"]);
    expect(firstValue(options, "json")).toBe("true");
  });

  it("rejects old names and base64-like compressed blobs", () => {
    const encoded = "A".repeat(220);
    const result = validatePlannablePlan(encoded);

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Content looks binary/base64-like instead of semantically readable.");

    const oldName = validatePlannablePlan("@PlanPack v0.1\n\nID=PART-001");
    expect(oldName.errors).toContain("Uses old @PlanPack name.");
  });

  it("compresses markdown into readable PlannablePlan format with context and token savings", () => {
    const source = [
      "# Notifications",
      "",
      "## Tasks",
      "- Add email sender",
      "",
      "## Acceptance",
      "- Users receive an email",
      "",
      "## Verification",
      "- npm test",
      "",
      "## Constraints",
      "- Use existing mail provider"
    ].join("\n");
    const compressed = compressToPlannablePlan(source);

    expect(compressed).toContain(PLANNABLE_PLAN_HEADER);
    expect(compressed).toContain("CTX:");
    expect(compressed).toContain("- Use existing mail provider");
    expect(estimateTokens(compressed)).toBeLessThan(estimateTokens(source) + 250);
  });
});

describe("documentation contract", () => {
  it("documents CLI and desktop/agent skill installation paths", async () => {
    const install = await readFile(path.join(repoRoot, "docs", "INSTALL.md"), "utf8");

    expect(install).toContain("npm install -g plannable");
    expect(install).toContain("Look at this GitHub repo and install Plannable");
    expect(install).toContain("https://github.com/suntay44/Plannable");
    expect(install).toContain(".agents/skills/plannable");
    expect(install).toContain(".codex/skills/plannable");
    expect(install).toContain(".claude/skills/plannable");
    expect(install).toContain(".cursor/commands");
    expect(install).toContain("Plannable is a skill, not a hosted plugin");
  });
});
