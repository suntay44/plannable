import { parseOptions } from "../core/options.js";
import { getStatusSummary, statusCommand } from "./status.js";
import { getVerifySummary, verifyCommand } from "./verify.js";

export async function doctorCommand(cwd: string, args: string[] = []): Promise<void> {
  const options = parseOptions(args);
  if (options.values.json) {
    const status = await getStatusSummary(cwd);
    const verify = await getVerifySummary(cwd);
    console.log(JSON.stringify({ status, verify }, null, 2));
    if (!verify.ok) {
      process.exitCode = 1;
    }
    return;
  }

  console.log("# Plannable Doctor");
  console.log("");
  await statusCommand(cwd);
  console.log("");
  console.log("# Verification");
  await verifyCommand(cwd);
}
