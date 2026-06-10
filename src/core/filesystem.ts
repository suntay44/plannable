import { mkdir, readFile, stat, writeFile } from "node:fs/promises";
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
  if (!overwrite && await pathExists(filePath)) {
    throw new Error(`Refusing to overwrite existing file: ${filePath}`);
  }
  await ensureDir(path.dirname(filePath));
  await writeFile(filePath, content, "utf8");
}

export async function readText(filePath: string): Promise<string> {
  return readFile(filePath, "utf8");
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
  return path.resolve(cwd, fileName);
}

