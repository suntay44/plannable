import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage } from "../../_components/docs-page";

export const metadata: Metadata = {
  title: "Plannable vs spec-kit",
  description:
    "Compare Plannable’s execution-first, evidence-gated workflow with spec-kit’s deeper specification-first approach.",
  alternates: { canonical: "/compare/spec-kit" }
};

export default function SpecKitComparisonPage() {
  return (
    <DocsPage
      eyebrow="Comparison"
      title="Plannable or spec-kit?"
      summary="Choose Plannable for compact execution parts and evidence-gated progress. Choose spec-kit when deeper up-front specification and governance are the main need."
    >
      <h2>The short answer</h2>
      <p>
        Plannable and GitHub’s spec-kit solve adjacent problems. Plannable is execution-first: it narrows work to one
        self-contained part and locks completion behind evidence. Spec-kit is specification-first: it develops a
        constitution, specification, plan, and tasks before implementation.
      </p>

      <h2>Side-by-side</h2>
      <table>
        <thead>
          <tr>
            <th>Question</th>
            <th>Plannable</th>
            <th>spec-kit</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Primary strength</td>
            <td>Small execution context and inspectable progress</td>
            <td>Deeper specification workflow and governance</td>
          </tr>
          <tr>
            <td>Completion model</td>
            <td>Evidence required before checkoff</td>
            <td>Task/checklist workflow</td>
          </tr>
          <tr>
            <td>Agent context</td>
            <td>One compressed part with a context summary</td>
            <td>Specification, plan, tasks, and supporting project context</td>
          </tr>
          <tr>
            <td>Good fit</td>
            <td>Multi-session implementation where handoff and proof matter</td>
            <td>Projects that benefit from structured clarification and design governance</td>
          </tr>
        </tbody>
      </table>

      <h2>Can I use both?</h2>
      <p>
        Yes. A team can use spec-kit to develop a detailed specification, then compress approved implementation slices
        into PlannablePlan parts for evidence-gated execution. Treat the specification as the design source and
        Plannable as the execution ledger.
      </p>

      <h2>About the context benchmark</h2>
      <p>
        The repository includes a reproducible benchmark comparing the token count of one Plannable part with the core
        spec-kit artifacts for the same sample. It is a methodology-bound comparison, not a universal performance
        guarantee. Read the{" "}
        <a href="https://github.com/suntay44/Plannable/blob/main/docs/BENCHMARK.md">benchmark and assumptions</a>.
      </p>
      <p>
        Ready for the smaller execution loop? <Link href="/docs/getting-started">Create your first Plannable plan</Link>.
      </p>
    </DocsPage>
  );
}
