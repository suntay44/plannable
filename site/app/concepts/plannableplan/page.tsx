import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock, DocsPage } from "../../_components/docs-page";

export const metadata: Metadata = {
  title: "What is PlannablePlan?",
  description:
    "Learn how the compact, text-based PlannablePlan .ai.md format carries one implementation part plus enough context for an AI coding agent.",
  alternates: { canonical: "/concepts/plannableplan" }
};

export default function PlannablePlanPage() {
  return (
    <DocsPage
      eyebrow="Concept"
      title="PlannablePlan is a compact execution brief."
      summary="A PlannablePlan .ai.md file describes one implementation part in symbolic text: outcome, context, tasks, acceptance criteria, verification, completion updates, and stop conditions."
    >
      <h2>Why a separate format?</h2>
      <p>
        Long human plans consume the context an agent needs for code. Plannable keeps the master plan readable, then
        gives the agent only the current compressed part. The <code>CTX:</code> block carries the overall goal, prior
        outcome, and next outcome so the part can stand alone.
      </p>

      <h2>Example</h2>
      <CodeBlock>{`@PlannablePlan v0.1

ID=PART-002
PH=CORE
SCN=SCN-002
OUT=Deal pipeline works
DEP=[PART-001]

CTX:
- product: CRM — managing contacts and deals
- prior: contact management works
- next: follow-up tasks work

T:
1 create:deal.entity
2 build:pipeline.stages

AC:
- a deal can move between stages

V:
- npm test?

DONE:
- append evidence
- mark PART-002 complete

S:
- stop if database ownership is unclear`}</CodeBlock>

      <h2>What do the blocks mean?</h2>
      <table>
        <thead>
          <tr>
            <th>Block</th>
            <th>Purpose</th>
          </tr>
        </thead>
        <tbody>
          {[
            ["ID / SCN / OUT", "Stable identity, source scenario, and observable part outcome."],
            ["CTX", "The smallest useful summary of the whole execution arc."],
            ["T", "Ordered implementation work, written compactly."],
            ["AC", "Conditions that must be true before the part is done."],
            ["V", "Checks or manual QA expected during validation."],
            ["DONE", "Source-of-truth updates required after evidence exists."],
            ["S", "Conditions where the agent should stop instead of guessing."]
          ].map(([block, purpose]) => (
            <tr key={block}>
              <td>
                <code>{block}</code>
              </td>
              <td>{purpose}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Is it compressed or encoded?</h2>
      <p>
        It is compressed but still readable text. PlannablePlan does not use binary, base64, gzip, or an opaque
        serialization format by default. Parsers tolerate unknown blocks so the v0.1 format can evolve without making
        every addition a breaking change.
      </p>
      <p>
        See the{" "}
        <a href="https://github.com/suntay44/Plannable/blob/main/docs/PLANNABLE_PLAN_SPEC.md">full format specification</a>{" "}
        or <Link href="/docs/getting-started">create a plan</Link>.
      </p>
    </DocsPage>
  );
}
