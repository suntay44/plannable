import { randomUUID } from "node:crypto";
import { lstat, mkdir, readFile, realpath, rename, stat, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

export async function pathExists(filePath: string): Promise<boolean> {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true });
}

export async function writeText(filePath: string, content: string, overwrite = false): Promise<void> {
  await ensureDir(path.dirname(filePath));
  await refuseSymbolicLink(filePath);

  if (!overwrite) {
    try {
      await writeFile(filePath, content, { encoding: "utf8", flag: "wx" });
      return;
    } catch (error) {
      const fsError = error as NodeJS.ErrnoException;
      if (fsError.code === "EEXIST") {
        throw new Error(`Refusing to overwrite existing file: ${filePath}`, { cause: error });
      }
      throw error;
    }
  }

  const tempPath = path.join(path.dirname(filePath), `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`);
  try {
    await writeFile(tempPath, content, { encoding: "utf8", flag: "wx" });
    await rename(tempPath, filePath);
  } catch (error) {
    await unlink(tempPath).catch(() => undefined);
    throw error;
  }
}

export async function readText(filePath: string): Promise<string> {
  return readFile(filePath, "utf8");
}

export async function readProjectText(projectRoot: string, relativePath: string): Promise<string> {
  return readText(await resolveExistingProjectPath(projectRoot, relativePath));
}

export async function writeProjectText(
  projectRoot: string,
  relativePath: string,
  content: string,
  overwrite = false
): Promise<void> {
  const filePath = resolveLexicalProjectPath(projectRoot, relativePath);
  await ensureDir(projectRoot);
  const realRoot = await realpath(projectRoot);
  await ensureContainedProjectDir(projectRoot, path.dirname(filePath), realRoot);
  const realParent = await realpath(path.dirname(filePath));
  assertContained(realRoot, realParent, relativePath);

  await writeText(filePath, content, overwrite);
}

export function repoRootFromImportMeta(importMetaUrl: string): string {
  const filePath = fileURLToPath(importMetaUrl);
  return path.resolve(path.dirname(filePath), "..", "..");
}

export async function readTemplate(name: string): Promise<string> {
  const root = repoRootFromImportMeta(import.meta.url);
  return readText(path.join(root, "templates", name));
}

export function resolveProjectPath(cwd: string, fileName: string): string {
  return resolveLexicalProjectPath(cwd, fileName);
}

async function resolveExistingProjectPath(projectRoot: string, relativePath: string): Promise<string> {
  const lexicalPath = resolveLexicalProjectPath(projectRoot, relativePath);
  const [realRoot, realTarget] = await Promise.all([realpath(projectRoot), realpath(lexicalPath)]);
  assertContained(realRoot, realTarget, relativePath);
  return realTarget;
}

function resolveLexicalProjectPath(projectRoot: string, relativePath: string): string {
  if (path.isAbsolute(relativePath)) {
    throw new Error(`Project path must be relative: ${relativePath}`);
  }

  const resolvedRoot = path.resolve(projectRoot);
  const resolvedTarget = path.resolve(resolvedRoot, relativePath);
  assertContained(resolvedRoot, resolvedTarget, relativePath);
  return resolvedTarget;
}

function assertContained(root: string, target: string, inputPath: string): void {
  const relative = path.relative(root, target);
  if (relative === "" || (!relative.startsWith(`..${path.sep}`) && relative !== ".." && !path.isAbsolute(relative))) {
    return;
  }
  throw new Error(`Project path escapes the project root: ${inputPath}`);
}

async function ensureContainedProjectDir(projectRoot: string, targetDir: string, realRoot: string): Promise<void> {
  const resolvedRoot = path.resolve(projectRoot);
  const relativeDir = path.relative(resolvedRoot, targetDir);
  assertContained(resolvedRoot, targetDir, relativeDir);

  let current = resolvedRoot;
  for (const segment of relativeDir.split(path.sep).filter(Boolean)) {
    current = path.join(current, segment);
    try {
      const info = await lstat(current);
      if (info.isSymbolicLink()) {
        throw new Error(`Refusing to traverse symbolic link directory: ${current}`);
      }
      if (!info.isDirectory()) {
        throw new Error(`Project path parent is not a directory: ${current}`);
      }
    } catch (error) {
      const fsError = error as NodeJS.ErrnoException;
      if (fsError.code !== "ENOENT") {
        throw error;
      }
      await mkdir(current);
    }

    assertContained(realRoot, await realpath(current), path.relative(resolvedRoot, current));
  }
}

async function refuseSymbolicLink(filePath: string): Promise<void> {
  try {
    if ((await lstat(filePath)).isSymbolicLink()) {
      throw new Error(`Refusing to write through symbolic link: ${filePath}`);
    }
  } catch (error) {
    const fsError = error as NodeJS.ErrnoException;
    if (fsError.code !== "ENOENT") {
      throw error;
    }
  }
}
