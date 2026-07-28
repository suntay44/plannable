import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock, DocsPage } from "../../_components/docs-page";

export const metadata: Metadata = {
  title: "CLI command reference",
  description:
    "A concise reference for Plannable create, run-next, status, evidence, complete, verify, doctor, repair, compress, and expand.",
  alternates: { canonical: "/docs/commands" }
};

const commands = [
  ["create", 'plannable create "CRM"', "Generate a scenario-driven master plan and three agent-readable parts."],
  ["init", 'plannable init "Project"', "Add blank planning files to an existing project."],
  ["run-next", "plannable run-next", "Print the next pending part, path, scenario, and estimated context cost."],
  ["status", "plannable status", "Show progress grouped by phase using the real evidence log."],
  ["evidence", 'plannable evidence PART-001 "summary" --check "npm test"', "Append substantive proof for a part."],
  ["complete", "plannable complete PART-001", "Mark a part complete; refuses when evidence is missing."],
  ["verify", "plannable verify", "Check files, structure, paths, state alignment, and evidence."],
  ["doctor", "plannable doctor", "Combine status and verification into one report."],
  ["repair", "plannable repair", "Regenerate state and evidence markers from the source-of-truth files."],
  ["compress", "plannable compress plan.md", "Convert a Markdown task file to symbolic PlannablePlan."],
  ["expand", "plannable expand plans/PART1_PLAN.ai.md", "Expand a compressed part into readable Markdown."]
];

export default function CommandsPage() {
  return (
    <DocsPage
      eyebrow="Reference"
      title="The Plannable CLI, command by command."
      summary="The shortest reliable loop is create → run-next → evidence → complete → verify. Supporting commands inspect, repair, compress, or expand the plan."
    >
      <h2>Core workflow</h2>
      <table>
        <thead>
          <tr>
            <th>Command</th>
            <th>Example</th>
            <th>Result</th>
          </tr>
        </thead>
        <tbody>
          {commands.map(([name, example, result]) => (
            <tr key={name}>
              <td>
                <code>{name}</code>
              </td>
              <td>
                <code>{example}</code>
              </td>
              <td>{result}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Evidence options</h2>
      <p>
        Evidence must include at least one concrete artifact. Repeat options when a part has multiple files or checks.
      </p>
      <CodeBlock>{`--artifact "path or result"
--file "src/changed.ts"
--check "npm test"
--note "manual QA at 390px"
--unavailable "device lab was not accessible"`}</CodeBlock>
      <p>
        <code>--unavailable</code> records why a verification step could not run. It is explicit evidence, not a claim
        that the check passed.
      </p>

      <h2>Machine-readable output</h2>
      <p>
        Workflow inspection commands support <code>--json</code>. Verification supports <code>--verbose</code>, and
        repair supports <code>--dry-run</code>. Unknown options fail instead of silently changing positional input.
      </p>
      <CodeBlock>{`plannable status --json
plannable verify --json
plannable repair --dry-run --json`}</CodeBlock>

      <h2>Where is the complete reference?</h2>
      <p>
        The repository’s{" "}
        <a href="https://github.com/suntay44/Plannable/blob/main/docs/COMMANDS.md">command documentation</a> includes
        output shapes and edge cases. For the format itself, read <Link href="/concepts/plannableplan">PlannablePlan</Link>.
      </p>
    </DocsPage>
  );
}
