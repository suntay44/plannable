import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { expect, it } from "vitest";
import { createCommand } from "../src/commands/create.ts";
import {
  compressToPlannablePlan,
  expandPlannablePlan,
  parsePlannablePlan,
  renderPartPlan
} from "../src/core/plannable-plan.ts";
import { buildPlanModel } from "../src/core/templates.ts";

it("uses declared package scripts and manager without inventing checks or paths", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "plannable detected checks "));
  try {
    await mkdir(path.join(cwd, "src"));
    await writeFile(
      path.join(cwd, "package.json"),
      JSON.stringify({
        packageManager: "pnpm@10.0.0",
        scripts: { lint: "eslint .", test: "vitest run", deploy: "do not run" }
      })
    );
    await createCommand({ cwd, args: ["CRM"] });
    const content = await readFile(path.join(cwd, "plans/PART1_PLAN.ai.md"), "utf8");
    expect(parsePlannablePlan(content).verification).toEqual(["- pnpm run lint", "- pnpm run test"]);
    expect(content).toContain("? src/");
    expect(content).not.toContain("components/*");
    expect(content).not.toContain("npm run build");
    expect(content).not.toContain("deploy");
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});

it("does not suggest npm scripts in a non-Node project", async () => {
  const cwd = await mkdtemp(path.join(tmpdir(), "plannable unknown checks "));
  try {
    await writeFile(path.join(cwd, "pyproject.toml"), '[project]\nname = "crm"\n');
    await createCommand({ cwd, args: ["CRM"] });
    const parsed = parsePlannablePlan(await readFile(path.join(cwd, "plans/PART1_PLAN.ai.md"), "utf8"));
    expect(parsed.verification.join("\n")).not.toContain("npm");
    expect(parsed.verification.join("\n")).toContain("Identify");
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});

it("preserves the exact request instead of normalizing away flags and exclusions", async () => {
  const request = "CRM with --offline and snake_case IDs; do not add auth";
  const model = buildPlanModel(request);
  const content = await renderPartPlan(model, model.scenarios[0], 0);
  expect(content).toContain(JSON.stringify(request));
});

it("preserves Markdown prose, stop conditions, and fenced commands during compression", () => {
  const source =
    "# Mail\n## Tasks\n- Add sender\n  Reuse the transport.\n## Acceptance\nEmail arrives exactly once.\n## Verification\n```bash\nNODE_ENV=test\nnpm test -- --runInBand\n```\n## Stop conditions\n- Stop if credentials are missing.\n";
  const result = parsePlannablePlan(compressToPlannablePlan(source));
  expect(result.tasks.join("\n")).toContain("Reuse the transport.");
  expect(result.acceptanceCriteria).toContain("- Email arrives exactly once.");
  expect(result.verification).toContain('- code[bash]: "NODE_ENV=test\\nnpm test -- --runInBand"');
  expect(result.stopConditions).toContain("- Stop if credentials are missing.");
});

it("does not replace or discard fields when compressing an existing PlannablePlan", () => {
  const original = compressToPlannablePlan("# Mail\n- Add sender") + "\n\nCUSTOM:\n- preserve-me\n";
  expect(compressToPlannablePlan(original)).toBe(original);
});

it("refuses unterminated fenced blocks rather than producing an incomplete plan", () => {
  expect(() => compressToPlannablePlan("# Mail\n## Verification\n```bash\nnpm test")).toThrow(/Unclosed code fence/);
});

it("keeps numeric goals and task names intact when expanding", async () => {
  const input = compressToPlannablePlan(
    "# 2FA setup\n## Tasks\n- 2FA login\n## Acceptance\n- 100 users can sign in\n## Stop conditions\n- Stop if existing login breaks"
  );
  expect(parsePlannablePlan(input).goal).toBe("2FA setup");
  expect(expandPlannablePlan(input)).toContain("- 2FA login");
  expect(expandPlannablePlan(input)).toContain("- 100 users can sign in");
  expect(expandPlannablePlan(input)).toContain("Stop if existing login breaks");
});

it("warns only when imported acceptance criteria simply copy tasks", async () => {
  const { validatePlannablePlan } = await import("../src/core/plannable-plan.ts");
  expect(validatePlannablePlan(compressToPlannablePlan("# Mail\n- Add sender")).warnings.join("\n")).toContain(
    "repeat tasks"
  );
  expect(
    validatePlannablePlan(
      compressToPlannablePlan("# Mail\n## Tasks\n- Add sender\n## Acceptance\n- Email arrives once")
    ).warnings
  ).toEqual([]);
});

it("detects conflicting lockfiles and refuses malformed manifests before writing plans", async () => {
  const { detectProjectContext } = await import("../src/core/project-context.ts");
  const cwd = await mkdtemp(path.join(tmpdir(), "plannable ambiguous checks "));
  try {
    await writeFile(path.join(cwd, "package.json"), JSON.stringify({ scripts: { test: "vitest" } }));
    await writeFile(path.join(cwd, "package-lock.json"), "{}");
    await writeFile(path.join(cwd, "yarn.lock"), "");
    expect((await detectProjectContext(cwd)).verification[0]).toContain("Identify");
    await writeFile(path.join(cwd, "package.json"), "{invalid");
    await expect(createCommand({ cwd, args: ["CRM"] })).rejects.toThrow("package.json is not valid JSON");
    await expect(readFile(path.join(cwd, "MASTER_PLAN.md"))).rejects.toMatchObject({ code: "ENOENT" });
  } finally {
    await rm(cwd, { recursive: true, force: true });
  }
});

it("keeps code resembling plan fields inside its original block", () => {
  const code = "T:\n  preserve indent\nID=PART-999\n```";
  const compressed = compressToPlannablePlan("# Mail\n## Verification\n````text\n" + code + "\n````");
  expect(parsePlannablePlan(compressed).id).toBe("PART-001");
  expect(parsePlannablePlan(compressed).verification).toEqual(["- code[text]: " + JSON.stringify(code)]);
  expect(expandPlannablePlan(compressed)).toContain("````text\n" + code + "\n````");
});
