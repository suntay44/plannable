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
  plannable init

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
    default:
      throw new Error(`Unknown command: ${command}\n\n${HELP}`);
  }
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
