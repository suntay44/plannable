import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock } from "./_components/docs-page";

export const metadata: Metadata = {
  title: "Evidence-gated plans for AI coding agents",
  description:
    "Split implementation work into small, agent-readable parts and require concrete evidence before any part is marked complete.",
  alternates: { canonical: "/" }
};

const workflow = [
  {
    number: "01",
    command: 'plannable create "CRM"',
    title: "Create a scenario-driven plan",
    copy: "Start with a short master plan for humans and compressed PlannablePlan files for agents."
  },
  {
    number: "02",
    command: "plannable run-next",
    title: "Load one part, not the whole project",
    copy: "The next part carries its goal, context, tasks, acceptance criteria, and stop conditions."
  },
  {
    number: "03",
    command: "plannable evidence PART-001 …",
    title: "Prove the outcome before checkoff",
    copy: "Completion stays locked until the evidence log names a file, check, artifact, note, or unavailable reason."
  }
];

export default function Home() {
  return (
    <main id="main">
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Planning that survives execution</p>
            <h1>Implementation plans that AI agents can actually finish.</h1>
            <p className="lede">
              Plannable is a TypeScript CLI and open agent skill that turns a product idea into small execution parts.
              Agents load one part at a time, and nothing is marked done without recorded evidence.
            </p>
            <div className="hero-actions">
              <Link className="button button-primary" href="/docs/getting-started">
                Start in five minutes
              </Link>
              <a className="button button-quiet" href="https://github.com/suntay44/Plannable">
                Read the source
              </a>
            </div>
            <ul className="proof-list" aria-label="Project highlights">
              <li>MIT licensed</li>
              <li>Zero runtime dependencies</li>
              <li>Node.js 22+</li>
            </ul>
          </div>
          <div className="terminal-card" aria-label="Example Plannable workflow">
            <div className="terminal-top">
              <span />
              <span />
              <span />
              <p>agent session</p>
            </div>
            <CodeBlock>{`$ plannable run-next

Next part: P2
Scenario: SCN-002
Load only: plans/PART2_PLAN.ai.md

OUT=Deal pipeline works
AC:
- a deal can move through stages

$ plannable complete PART-002
Refusing: evidence required`}</CodeBlock>
            <div className="terminal-note">
              <span className="pulse" />
              Completion stays honest by default.
            </div>
          </div>
        </div>
      </section>

      <section className="signal-bar" aria-label="Core behavior">
        <div className="shell signal-grid">
          <p>
            <strong>1 part</strong>
            <span>loaded at a time</span>
          </p>
          <p>
            <strong>3 sources</strong>
            <span>master, evidence, generated state</span>
          </p>
          <p>
            <strong>0 runtime deps</strong>
            <span>Node built-ins only</span>
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-heading">
            <p className="eyebrow">The execution loop</p>
            <h2>Make the next useful action unmistakable.</h2>
            <p>Every command narrows the agent’s focus and leaves an inspectable trail for the next session.</p>
          </div>
          <div className="workflow-grid">
            {workflow.map((step) => (
              <article className="workflow-card" key={step.number}>
                <div className="workflow-meta">
                  <span>{step.number}</span>
                  <code>{step.command}</code>
                </div>
                <h3>{step.title}</h3>
                <p>{step.copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-ink">
        <div className="shell split-section">
          <div>
            <p className="eyebrow eyebrow-light">Why evidence gating matters</p>
            <h2>A checked box should mean the outcome exists.</h2>
          </div>
          <div className="answer-stack">
            <p>
              <strong>Before completion:</strong> Plannable looks for substantive evidence tied to the part.
            </p>
            <p>
              <strong>After completion:</strong> state is regenerated from the master plan and evidence log, reducing
              hand-edited drift.
            </p>
            <p>
              <strong>During review:</strong> <code>plannable verify</code> checks structure, state alignment, paths,
              and evidence markers.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="shell split-section">
          <div>
            <p className="eyebrow">Open agent skill</p>
            <h2>One workflow across your coding agents.</h2>
            <p className="section-copy">
              Plannable ships platform-specific skill instructions for Codex, Claude Code, and Cursor. Terminal commands
              stay the source of truth; launch syntax adapts to each platform.
            </p>
            <Link className="text-link" href="/docs/getting-started">
              Choose your install path <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="agent-list">
            {[
              ["Codex", "$plannable run-next"],
              ["Claude Code", "/plannable run-next"],
              ["Cursor", "/plannable run-next"],
              ["Terminal", "plannable run-next"]
            ].map(([name, command]) => (
              <div key={name}>
                <strong>{name}</strong>
                <code>{command}</code>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section compare-strip">
        <div className="shell compare-grid">
          <div>
            <p className="eyebrow">A deliberate tradeoff</p>
            <h2>Execution-first, not specification-heavy.</h2>
          </div>
          <p>
            Use Plannable when small context windows, explicit next actions, and evidence-gated progress matter most.
            Use a deeper specification toolkit when governance and up-front analysis matter more.
          </p>
          <Link className="button button-dark" href="/compare/spec-kit">
            Compare with spec-kit
          </Link>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell">
          <p className="eyebrow">Start with the next part</p>
          <h2>Give your agent a plan it can carry.</h2>
          <CodeBlock>{`git clone https://github.com/suntay44/Plannable.git
cd Plannable && npm install && npm run build && npm link
plannable create "your product idea"`}</CodeBlock>
          <div className="hero-actions">
            <Link className="button button-primary" href="/docs/getting-started">
              Read the install guide
            </Link>
            <Link className="button button-quiet" href="/faq">
              Common questions
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
