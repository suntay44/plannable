#!/usr/bin/env node
import path from "node:path";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { compressCommand } from "./commands/compress.js";
import { completeCommand } from "./commands/complete.js";
import { createCommand } from "./commands/create.js";
import { doctorCommand } from "./commands/doctor.js";
import { evidenceCommand } from "./commands/evidence.js";
import { expandCommand } from "./commands/expand.js";
import { initCommand } from "./commands/init.js";
import { repairCommand } from "./commands/repair.js";
import { runNextCommand } from "./commands/run-next.js";
import { statusCommand } from "./commands/status.js";
import { verifyCommand } from "./commands/verify.js";

async function cliVersion(): Promise<string> {
  const packagePath = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "package.json");
  const pkg = JSON.parse(await readFile(packagePath, "utf8")) as { version: string };
  return pkg.version;
}

const HELP = `Usage:
  plannable create "CRM"
  plannable create "inventory management app"
  plannable run-next
  plannable status
  plannable verify
  plannable evidence PART-001 "summary" --artifact "npm test"
  plannable complete PART-001
  plannable doctor
  plannable repair
  plannable compress plan.md
  plannable expand [plans/PART1_PLAN.ai.md]

Advanced:
  plannable init ["Project Name"]

Options:
  --json      machine-readable output (run-next, status, verify, doctor, repair, evidence, complete)
  --verbose   verify: list every passing check, not just failures
  --force     create/init: overwrite existing plan files
  --dry-run   repair: report drift without writing files

Platform launchers:
  Terminal: plannable create "CRM"
  Codex:    $plannable create a CRM
  Claude:   /plannable create a CRM
  Cursor:   /plannable create a CRM
`;

async function main(argv: string[]): Promise<void> {
  const [command, ...args] = argv;
  const cwd = process.cwd();

  switch (command) {
    case "create":
      await createCommand({ cwd, args });
      break;
    case "init":
      await initCommand(cwd, args);
      break;
    case "run-next":
      await runNextCommand(cwd, args);
      break;
    case "status":
      await statusCommand(cwd, args);
      break;
    case "verify":
      await verifyCommand(cwd, args);
      break;
    case "evidence":
      await evidenceCommand(cwd, args);
      break;
    case "complete":
      await completeCommand(cwd, args);
      break;
    case "doctor":
      await doctorCommand(cwd, args);
      break;
    case "repair":
      await repairCommand(cwd, args);
      break;
    case "compress":
      await compressCommand(cwd, args);
      break;
    case "expand":
      await expandCommand(cwd, args);
      break;
    case "-v":
    case "--version":
      console.log(await cliVersion());
      break;
    case "-h":
    case "--help":
    case undefined:
      console.log(`Plannable v${await cliVersion()}\n\n${HELP}`);
      break;
    default: {
      const suggestion = closestCommand(command);
      const hint = suggestion ? ` — did you mean "${suggestion}"?` : "";
      throw new Error(`Unknown command: ${command}${hint}\n\n${HELP}`);
    }
  }
}

const COMMANDS = ["create", "init", "run-next", "status", "verify", "evidence", "complete", "doctor", "repair", "compress", "expand"];

function closestCommand(input: string): string | undefined {
  let best: { command: string; distance: number } | undefined;
  for (const command of COMMANDS) {
    const distance = editDistance(input.toLowerCase(), command);
    if (!best || distance < best.distance) {
      best = { command, distance };
    }
  }
  return best && best.distance <= 3 ? best.command : undefined;
}

function editDistance(a: string, b: string): number {
  const previous = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let diagonal = previous[0];
    previous[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const insertOrDelete = Math.min(previous[j], previous[j - 1]) + 1;
      const substitute = diagonal + (a[i - 1] === b[j - 1] ? 0 : 1);
      diagonal = previous[j];
      previous[j] = Math.min(insertOrDelete, substitute);
    }
  }
  return previous[b.length];
}

const PLAN_FILES = new Set(["MASTER_PLAN.md", "PLAN_STATE.md", "PLAN_EVIDENCE.md"]);

main(process.argv.slice(2)).catch((error: unknown) => {
  const fsError = error as NodeJS.ErrnoException;
  if (fsError?.code === "ENOENT" && typeof fsError.path === "string") {
    if (PLAN_FILES.has(path.basename(fsError.path))) {
      console.error(`No Plannable plan found here (missing ${path.basename(fsError.path)}).`);
      console.error('Run: plannable create "<product idea>" to start one.');
    } else {
      console.error(`File not found: ${fsError.path}`);
    }
    process.exitCode = 1;
    return;
  }

  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exitCode = 1;
});
