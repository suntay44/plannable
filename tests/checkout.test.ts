import { execFile } from "node:child_process";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { expect, it } from "vitest";

const exec = promisify(execFile);

it("keeps a Windows-style Git checkout compatible with Prettier", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "plannable checkout "));
  const sample = path.join(root, "sample.ts");
  const env = { ...process.env, GIT_CONFIG_GLOBAL: path.join(root, "gitconfig"), GIT_CONFIG_NOSYSTEM: "1" };
  const git = (...args: string[]) => exec("git", ["-c", "core.autocrlf=true", ...args], { cwd: root, env });
  const prettier = () =>
    exec(process.execPath, [path.resolve("node_modules/prettier/bin/prettier.cjs"), "--check", "sample.ts"], {
      cwd: root
    });
  try {
    await writeFile(env.GIT_CONFIG_GLOBAL, "");
    await writeFile(path.join(root, ".prettierrc.json"), await readFile(".prettierrc.json"));
    await writeFile(sample, "const value = 1;\n");
    await git("init");
    await git("add", "sample.ts");
    await rm(sample);
    await git("checkout-index", "-f", "sample.ts");
    expect(await readFile(sample, "utf8")).toContain("\r\n");
    await expect(prettier()).rejects.toMatchObject({ code: 1 });

    await writeFile(path.join(root, ".gitattributes"), await readFile(".gitattributes"));
    await git("add", ".gitattributes");
    await rm(sample);
    await git("checkout-index", "-f", "sample.ts");
    expect(await readFile(sample, "utf8")).toBe("const value = 1;\n");
    expect((await prettier()).stdout).toContain("All matched files use Prettier code style!");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}, 30_000);
