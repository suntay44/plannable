import { execFile } from "node:child_process";
import { cp, mkdir, mkdtemp, readFile, rename, rm, symlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { promisify } from "node:util";
import { expect, it } from "vitest";

const exec = promisify(execFile);
const repoRoot = process.cwd();

it("builds at prepare time and installs a self-contained package outside the checkout", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "plannable install "));
  const source = path.join(root, "source with spaces");
  const consumer = path.join(root, "consumer with spaces");
  const prefix = path.join(root, "global prefix");
  const env = {
    PATH: process.env.PATH,
    SystemRoot: process.env.SystemRoot,
    HOME: path.join(root, "home"),
    USERPROFILE: path.join(root, "home"),
    NPM_CONFIG_USERCONFIG: path.join(root, "user.npmrc"),
    NPM_CONFIG_GLOBALCONFIG: path.join(root, "global.npmrc"),
    NPM_CONFIG_CACHE: path.join(root, "npm cache"),
    NPM_CONFIG_PREFIX: prefix,
    NPM_CONFIG_AUDIT: "false",
    NPM_CONFIG_FUND: "false"
  };
  const npmCli = process.env.npm_execpath;
  if (!npmCli) throw new Error("Run installation tests through npm test so npm_execpath is available.");
  const npm = (cwd: string, args: string[]) => exec(process.execPath, [npmCli, ...args], { cwd, env });
  try {
    for (const dir of [source, consumer, env.HOME]) await mkdir(dir, { recursive: true });
    for (const file of [env.NPM_CONFIG_USERCONFIG, env.NPM_CONFIG_GLOBALCONFIG]) await writeFile(file, "");
    for (const name of [
      "src",
      "templates",
      ".agents",
      ".codex",
      ".claude",
      ".cursor",
      "package.json",
      "tsconfig.json",
      "README.md",
      "LICENSE",
      "docs"
    ]) {
      await cp(path.join(repoRoot, name), path.join(source, name), { recursive: true });
    }
    await symlink(path.join(repoRoot, "node_modules"), path.join(source, "node_modules"), "junction");
    const { version } = JSON.parse(await readFile(path.join(source, "package.json"), "utf8")) as { version: string };
    // Git dependency installs need prepare; prepack alone can report success without a bin.
    await npm(source, ["run", "prepare"]);
    const built = path.join(source, "dist", "cli.js");
    expect((await exec(process.execPath, [built, "--version"], { cwd: consumer, env })).stdout.trim()).toBe(version);
    await npm(source, ["pack", "--pack-destination", root]);
    const tarball = path.join(root, `plannable-${version}.tgz`);
    await writeFile(path.join(consumer, "package.json"), '{"private":true}');
    await writeFile(path.join(consumer, "user-owned.txt"), "keep me");
    await npm(consumer, ["install", "--offline", "--save-dev", tarball]);
    await npm(consumer, ["install", "--offline", "--global", tarball]);
    await rename(source, path.join(root, "moved source"));
    const installed = path.join(consumer, "node_modules", "plannable");
    const globalPackage = path.join(
      prefix,
      ...(process.platform === "win32" ? [] : ["lib"]),
      "node_modules",
      "plannable"
    );
    for (const [index, packageRoot] of [installed, globalPackage].entries()) {
      const project = path.join(root, `smoke ${index}`);
      await mkdir(project);
      const cli = path.join(packageRoot, "dist", "cli.js");
      await exec(process.execPath, [cli, "create", "CRM"], { cwd: project, env });
      expect((await exec(process.execPath, [cli, "verify"], { cwd: project, env })).stdout).toContain(
        "verification passed"
      );
      await expect(exec(process.execPath, [cli, "create", "TODO"], { cwd: project, env })).rejects.toMatchObject({
        code: 1,
        stderr: expect.stringContaining("already exists")
      });
      expect(await readFile(path.join(packageRoot, ".agents/skills/plannable/agents/openai.yaml"), "utf8")).toContain(
        "display_name:"
      );
      expect(await readFile(path.join(packageRoot, ".cursor/commands/plannable-run-next.md"), "utf8")).toContain(
        "plannable run-next"
      );
    }
    await npm(consumer, ["install", "--offline", "--save-dev", tarball]);
    await npm(consumer, ["uninstall", "--offline", "--save-dev", "plannable"]);
    await npm(consumer, ["uninstall", "--offline", "--global", "plannable"]);
    await expect(readFile(path.join(installed, "package.json"))).rejects.toMatchObject({ code: "ENOENT" });
    await expect(readFile(path.join(globalPackage, "package.json"))).rejects.toMatchObject({ code: "ENOENT" });
    expect(await readFile(path.join(consumer, "user-owned.txt"), "utf8")).toBe("keep me");
  } finally {
    await rm(root, { recursive: true, force: true });
  }
}, 60_000);

it("uses supported Codex metadata without pretending to register CLI subcommands", async () => {
  const metadata = await readFile(path.join(repoRoot, ".agents/skills/plannable/agents/openai.yaml"), "utf8");
  expect(metadata).toMatch(/^interface:/);
  expect(metadata).toContain("display_name:");
  expect(metadata).not.toMatch(/^commands:/m);
  expect(await readFile(path.join(repoRoot, ".codex/skills/plannable/agents/openai.yaml"), "utf8")).toBe(metadata);
});

it.skipIf(process.platform === "win32")(
  "README installation stops if cloning into an existing directory fails",
  async () => {
    const root = await mkdtemp(path.join(tmpdir(), "plannable clone collision "));
    try {
      const target = path.join(root, "Plannable source");
      await mkdir(target);
      const marker = path.join(target, "package.json");
      await writeFile(marker, '{"name":"user-owned-project","private":true}');
      const readme = await readFile(path.join(repoRoot, "README.md"), "utf8");
      const command = readme.match(/```bash\n([\s\S]*?)```/)?.[1];
      if (!command) throw new Error("README is missing its installation command.");
      await expect(
        exec("bash", ["-c", command], {
          cwd: root,
          env: {
            PATH: process.env.PATH,
            HOME: root,
            GIT_CONFIG_GLOBAL: "/dev/null",
            GIT_CONFIG_NOSYSTEM: "1",
            GIT_TERMINAL_PROMPT: "0"
          }
        })
      ).rejects.toMatchObject({
        code: 128,
        stderr: expect.stringContaining("already exists")
      });
      expect(await readFile(marker, "utf8")).toBe('{"name":"user-owned-project","private":true}');
      await expect(readFile(path.join(target, "package-lock.json"))).rejects.toMatchObject({ code: "ENOENT" });
    } finally {
      await rm(root, { recursive: true, force: true });
    }
  }
);
