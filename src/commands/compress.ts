import path from "node:path";
import { estimateTokens, renderPlanFromMarkdown } from "../core/plannable-plan.js";
import { readText, writeText } from "../core/filesystem.js";

export async function compressCommand(cwd: string, args: string[]): Promise<void> {
  const inputArg = args[0];
  if (!inputArg) {
    throw new Error("Usage: plannable compress <input-file>");
  }

  const inputPath = path.resolve(cwd, inputArg);
  const input = await readText(inputPath);
  const output = renderPlanFromMarkdown(input, path.basename(inputPath, path.extname(inputPath)));
  const outputPath = path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}.ai.md`);

  await writeText(outputPath, output, true);

  const inputTokens = estimateTokens(input);
  const outputTokens = estimateTokens(output);
  const delta = inputTokens > 0 ? Math.round(((inputTokens - outputTokens) / inputTokens) * 100) : 0;
  console.log(`Wrote compressed PlannablePlan: ${outputPath}`);
  console.log(`Tokens (est.): input ~${inputTokens} -> output ~${outputTokens} (${delta >= 0 ? `${delta}% smaller` : `${-delta}% larger — source plan was already terse`})`);
}
