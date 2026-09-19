import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, it } from "vitest";
import { createCommand } from "../src/commands/create.ts";
import { loadGuidance } from "../src/core/guidance/catalog.ts";
import { selectGuidance } from "../src/core/guidance/select.ts";
import {
  compressToPlannablePlan,
  expandPlannablePlan,
  parsePlannablePlan,
  renderPartPlan,
  validatePlannablePlan
} from "../src/core/plannable-plan.ts";
import { buildPlanModel } from "../src/core/templates.ts";

async function privatePlan() {
  const model = buildPlanModel("CRM");
  return renderPartPlan(model, model.scenarios[0], 0, {
    files: ["? actual paths"],
    verification: ["Identify project checks"],
    guidance: selectGuidance(await loadGuidance(), {
      privateData: { value: true, source: "owner", reason: "Private records per business" }
    })
  });
}

it("keeps constraints and rule mappings through expand and recompress", async () => {
  const input = await privatePlan();
  const expanded = expandPlannablePlan(input);
  expect(expanded).toContain("Enforce record permissions at the trusted boundary.");
  const output = compressToPlannablePlan(expanded);
  expect(parsePlannablePlan(output).constraints).toContain(
    "- [access.owner] Enforce record permissions at the trusted boundary."
  );
  expect(validatePlannablePlan(output)).toEqual({ ok: true, warnings: [], errors: [] });
  expect(compressToPlannablePlan(input)).toBe(input);
});

it("warns when an expected safeguard loses verification or basis without breaking old plans", async () => {
  const input = await privatePlan();
  const damaged = input
    .replace(/^- \[access.owner\] Test both owners.*$/m, "")
    .replace(/^- basis\[access.owner\].*$/m, "");
  expect(validatePlannablePlan(damaged).ok).toBe(true);
  expect(validatePlannablePlan(damaged).warnings).toEqual(
    expect.arrayContaining([
      "Guidance access.owner: missing applicability basis.",
      "Guidance access.owner: missing actionable V mapping."
    ])
  );
  const legacy = compressToPlannablePlan(
    "# Mail\n## Tasks\n- Send email\n## Acceptance\n- Recipient receives one email"
  );
  expect(validatePlannablePlan(legacy)).toEqual({ ok: true, warnings: [], errors: [] });
});

it("reports malformed markers, undeclared tags and unresolved decisions", async () => {
  const input = await privatePlan();
  expect(validatePlannablePlan(input.replace("guidance: v1;", "guidance: v9;")).warnings).toContain(
    "Malformed or unsupported guidance marker; review coverage."
  );
  expect(validatePlannablePlan(input.replace("C:\n", "C:\n- [input.files] Check paths\n")).warnings).toContain(
    "Guidance input.files: not listed in expected rules."
  );
  expect(
    validatePlannablePlan(input.replace("CTX:\n", 'CTX:\n- decision[privateData]: "Ask intended access"\n')).warnings
  ).toContain("Guidance has unresolved decisions; inspect them before affected work.");
});

it("escapes observed reasons rather than inserting new plan fields", async () => {
  const model = buildPlanModel("CRM");
  const plan = await renderPartPlan(model, model.scenarios[0], 0, {
    files: [],
    verification: [],
    guidance: selectGuidance(await loadGuidance(), {
      privateData: { value: true, source: "owner", reason: "stated\nID=PART-999\nT:\nmalicious" }
    })
  });
  expect(parsePlannablePlan(plan).id).toBe("PART-001");
  expect(validatePlannablePlan(plan).ok).toBe(true);
});

it("creates three guided parts without inferring private accounts from a name or dependency", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "plannable guided create "));
  try {
    await writeFile(
      path.join(root, "package.json"),
      JSON.stringify({ dependencies: { "some-auth-library": "1.0.0" } })
    );
    await createCommand({ cwd: root, args: ["CRM without accounts or payments"] });
    for (let i = 1; i <= 3; i++) {
      const plan = await readFile(path.join(root, `plans/PART${i}_PLAN.ai.md`), "utf8");
      expect(plan).toContain("baseline.secrets@1");
      expect(plan).toContain("baseline.dependencies@1");
      expect(plan).not.toContain("access.login@1");
      expect(plan).not.toContain("services.events@1");
      expect(validatePlannablePlan(plan).warnings).toEqual([]);
    }
    expect(await readFile(path.join(root, "MASTER_PLAN.md"), "utf8")).toContain("not proof of application security");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
