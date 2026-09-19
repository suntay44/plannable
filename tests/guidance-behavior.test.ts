import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { DatabaseSync } from "node:sqlite";
import { expect, it } from "vitest";
import { writeProjectText } from "../src/core/filesystem.ts";

// Illustrative disposable controls, not AI-generated applications or a model-quality evaluation.
it("ownership failure checks detect a deliberately disabled authorization control", () => {
  const record = { owner: "business-b", customer: "Example" };
  const read = (business: string, protectedMode: boolean) =>
    !protectedMode || business === record.owner ? record : undefined;
  const passes = (protectedMode: boolean) =>
    read("business-a", protectedMode) === undefined && read("business-b", protectedMode) === record;
  expect(passes(true)).toBe(true);
  expect(passes(false)).toBe(false);
});

it("injection checks distinguish parameter binding from a vulnerable query", () => {
  const db = new DatabaseSync(":memory:");
  try {
    db.exec("CREATE TABLE records (owner TEXT); INSERT INTO records VALUES ('business-b')");
    const bound = (owner: string) => db.prepare("SELECT * FROM records WHERE owner = ?").all(owner);
    const unsafe = (owner: string) => db.prepare(`SELECT * FROM records WHERE owner = '${owner}'`).all();
    expect(bound("business-b")).toHaveLength(1);
    expect(bound("' OR 1=1 --")).toHaveLength(0);
    expect(unsafe("' OR 1=1 --")).toHaveLength(1);
  } finally {
    db.close();
  }
});

it("local-file preservation checks catch a removed containment check", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "plannable control test "));
  try {
    const project = path.join(root, "project");
    await mkdir(project);
    const marker = path.join(root, "user-owned.txt");
    await writeFile(marker, "keep");
    await expect(writeProjectText(project, "../user-owned.txt", "overwritten", true)).rejects.toThrow();
    expect(await readFile(marker, "utf8")).toBe("keep");
    await writeProjectText(project, "allowed.txt", "valid");
    expect(await readFile(path.join(project, "allowed.txt"), "utf8")).toBe("valid");
    // Deliberately bypass protection, only inside this disposable fixture.
    await writeFile(path.join(project, "../user-owned.txt"), "overwritten");
    expect(await readFile(marker, "utf8")).not.toBe("keep");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
