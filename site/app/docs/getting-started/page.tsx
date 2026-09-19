import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock, DocsPage } from "../../_components/docs-page";

export const metadata: Metadata = {
  title: "Getting started",
  description:
    "Install Plannable, create your first scenario-driven implementation plan, and run the evidence-gated agent workflow.",
  alternates: { canonical: "/docs/getting-started" }
};

export default function GettingStartedPage() {
  return (
    <DocsPage
      eyebrow="Getting started"
      title="Create your first executable plan."
      summary="Install the CLI from source, generate a plan, enrich its scenarios, then give your agent only the next compressed part."
    >
      <h2>What do I need?</h2>
      <p>
        Plannable requires Node.js 22 or newer. The published CLI has zero runtime dependencies; development tools are
        installed only when working on the repository.
      </p>

      <h2>Install from GitHub</h2>
      <CodeBlock>{`git clone https://github.com/suntay44/Plannable.git "Plannable source" &&
cd "Plannable source" &&
npm ci && npm run build && npm link &&
plannable --version`}</CodeBlock>
      <p className="callout">
        The npm release workflow is prepared, but the source install remains the documented path until the package is
        published.
      </p>

      <p>The source folder must remain while linked. Switch to your project before creating a plan. This installs the CLI only; copy one complete matching skill folder, including its references, separately. The <a href="https://github.com/suntay44/Plannable/blob/main/docs/INSTALL.md">platform installation guide</a> covers local installs, custom paths, updates and uninstall. A GitHub source ZIP needs extraction and a build; it is not a plugin ZIP or an individual skill upload.</p>

      <h2>Create a plan</h2>
      <CodeBlock>{`mkdir my-project && cd my-project
plannable create "SaaS billing dashboard"
plannable run-next`}</CodeBlock>
      <p>
        <code>create</code> writes a short <code>MASTER_PLAN.md</code>, an evidence log, generated state, and three
        compressed <code>plans/PART*_PLAN.ai.md</code> files. Common domains receive sharper scenario hints; other
        ideas receive a draft that should be made product-specific before implementation.
      </p>

      <h2>Plan applicable safeguards</h2>
      <p>The unreleased source guidance adds secret handling and changed-behavior checks to drafts. Your agent then inspects the project and adds relevant requirements. You decide who may access or share data; the agent handles routine technical safeguards. “Not sure” leaves an unresolved decision, not permission to expose data.</p>
      <p>Read <Link href="/docs/security-planning">security planning and its limits</Link> before treating a plan as application evidence.</p>

      <h2>Run the waterfall loop</h2>
      <ol>
        <li>
          <strong>Develop:</strong> load only the file printed by <code>plannable run-next</code> and implement its
          acceptance criteria.
        </li>
        <li>
          <strong>Validate:</strong> run the relevant tests, build, screenshots, or manual QA.
        </li>
        <li>
          <strong>Review:</strong> inspect the outcome against the scenario and record concrete evidence.
        </li>
        <li>
          <strong>Complete:</strong> check off the part only after evidence exists.
        </li>
      </ol>
      <CodeBlock>{`plannable evidence PART-001 "Billing overview works" \\
  --file src/app/billing/page.tsx \\
  --check "npm test"

plannable complete PART-001
plannable verify
plannable run-next`}</CodeBlock>

      <h2>Use it from an agent</h2>
      <table>
        <thead>
          <tr>
            <th>Platform</th>
            <th>Skill folder</th>
            <th>Launcher</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Codex</td>
            <td>
              <code>.agents/skills/plannable/</code>
            </td>
            <td>
              <code>$plannable run-next</code>
            </td>
          </tr>
          <tr>
            <td>Claude Code</td>
            <td>
              <code>.claude/skills/plannable/</code>
            </td>
            <td>
              <code>/plannable run-next</code>
            </td>
          </tr>
          <tr>
            <td>Cursor</td>
            <td>
              <code>.cursor/skills/plannable/</code>
            </td>
            <td>
              <code>/plannable run-next</code>
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        Next, review the <Link href="/docs/commands">command reference</Link> or learn how the{" "}
        <Link href="/concepts/plannableplan">PlannablePlan format</Link> keeps each part compact.
      </p>
    </DocsPage>
  );
}
