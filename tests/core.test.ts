import { access, mkdtemp, readFile, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { parseMasterPartStatuses } from "../src/core/master-plan.ts";
import { firstValue, allValues, parseOptions } from "../src/core/options.ts";
import { findPartById, markPartCompleteInMaster, normalizePartId, partNumberFromId } from "../src/core/progress.ts";
import { appendEvidence, hasEvidenceForPart } from "../src/core/evidence.ts";
import { readProjectText, writeProjectText } from "../src/core/filesystem.ts";
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
      ["# PLAN_STATE.md", "", "Project: CRM", "Created: 2026-06-11T00:00:00.000Z"].join("\n"),
      parseMasterPartStatuses(completedMaster),
      (partLabel) => partLabel === "PART-001"
    );

    expect(state).toContain("Project: CRM");
    expect(state).toContain("Created: 2026-06-11T00:00:00.000Z");
    expect(state).toContain("Next: plans/PART2_PLAN.ai.md");
    expect(state).toContain("- [x] Part 1: plans/PART1_PLAN.ai.md");
    expect(state).toContain("  - Evidence: recorded");
  });

  it("parses repeated CLI flags and boolean options", () => {
    const options = parseOptions(["evidence", "P1", "--artifact", "npm test", "--artifact", "npm run build", "--json"]);

    expect(options.positional).toEqual(["evidence", "P1"]);
    expect(firstValue(options, "artifact")).toBe("npm test");
    expect(allValues(options, "artifact")).toEqual(["npm test", "npm run build"]);
    expect(firstValue(options, "json")).toBe("true");
  });

  it("boolean flags never swallow the next argument", () => {
    const options = parseOptions(["evidence", "--json", "P1", "summary text", "--force", "--dry-run", "extra"]);

    expect(options.positional).toEqual(["evidence", "P1", "summary text", "extra"]);
    expect(firstValue(options, "json")).toBe("true");
    expect(firstValue(options, "force")).toBe("true");
    expect(firstValue(options, "dry-run")).toBe("true");
  });

  it("rejects old names and base64-like compressed blobs", () => {
    const encoded = "A".repeat(220);
    const result = validatePlannablePlan(encoded);

    expect(result.ok).toBe(false);
    expect(result.errors).toContain("Content looks binary/base64-like instead of semantically readable.");

    const oldName = validatePlannablePlan("@PlanPack v0.1\n\nID=PART-001");
    expect(oldName.errors).toContain("Uses old @PlanPack name.");
  });

  it("appendEvidence replaces hand-edited placeholder variants and appends otherwise", () => {
    const entry = { partId: "PART-001", summary: "Login verified.", artifacts: ["npm test"] };

    for (const placeholder of ["No evidence recorded yet.", "_No evidence recorded yet._", "No evidence recorded"]) {
      const log = ["# PLAN_EVIDENCE.md", "", "## Evidence Log", "", placeholder].join("\n");
      const next = appendEvidence(log, entry);
      expect(next).toContain("### PART-001");
      expect(next).not.toContain(placeholder);
    }

    const existing = ["# PLAN_EVIDENCE.md", "", "## Evidence Log", "", "### PART-000", "", "Setup done."].join("\n");
    const appended = appendEvidence(existing, entry);
    expect(appended).toContain("### PART-000");
    expect(appended.indexOf("### PART-001")).toBeGreaterThan(appended.indexOf("### PART-000"));
  });

  it("requires substantive evidence instead of accepting a heading or pending verification", () => {
    expect(hasEvidenceForPart("### PART-001\n\nImplemented.", "PART-001")).toBe(false);
    expect(
      hasEvidenceForPart(
        ["### PART-001", "", "Implemented.", "", "Artifacts:", "- Manual verification pending"].join("\n"),
        "PART-001"
      )
    ).toBe(false);
    expect(() =>
      appendEvidence("# PLAN_EVIDENCE.md", {
        partId: "PART-001",
        summary: "Implemented.",
        artifacts: []
      })
    ).toThrow(/requires at least one/);
    expect(
      hasEvidenceForPart(
        ["### PART-001", "", "Implemented.", "", "Artifacts:", "- Check: npm test"].join("\n"),
        "PART-001"
      )
    ).toBe(true);
  });

  it.skipIf(process.platform === "win32")("confines project reads and refuses symbolic-link writes", async () => {
    const root = await mkdtemp(path.join(tmpdir(), "plannable-filesystem-"));
    try {
      const project = path.join(root, "project");
      await writeFile(path.join(root, "outside.md"), "outside", "utf8");
      await writeProjectText(project, "inside.md", "inside");
      await expect(readProjectText(project, "../outside.md")).rejects.toThrow(/escapes the project root/);

      await symlink(path.join(root, "outside.md"), path.join(project, "linked.md"));
      await expect(writeProjectText(project, "linked.md", "changed", true)).rejects.toThrow(/symbolic link/);
      expect(await readFile(path.join(root, "outside.md"), "utf8")).toBe("outside");
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  });

  it.skipIf(process.platform === "win32")(
    "does not create directories through an intermediate symbolic link",
    async () => {
      const root = await mkdtemp(path.join(tmpdir(), "plannable-parent-link-"));
      try {
        const project = path.join(root, "project");
        const outside = path.join(root, "outside");
        await writeProjectText(project, "inside.md", "inside");
        await writeProjectText(outside, "existing.md", "outside");
        await symlink(outside, path.join(project, "linked"));

        await expect(writeProjectText(project, "linked/new/file.md", "unsafe", true)).rejects.toThrow(
          /symbolic link directory/
        );
        await expect(access(path.join(outside, "new"))).rejects.toMatchObject({ code: "ENOENT" });
      } finally {
        await rm(root, { recursive: true, force: true });
      }
    }
  );

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
