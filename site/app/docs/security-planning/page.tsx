import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage } from "../../_components/docs-page";

export const metadata: Metadata = {
  title: "Security planning for AI-built software",
  description:
    "Plan practical safeguards with your AI coding agent: relevant defaults, product choices, failure checks and evidence, with clear coverage limits.",
  alternates: { canonical: "/docs/security-planning" },
  openGraph: {
    title: "Security planning for AI-built software",
    description:
      "Plan practical safeguards with your AI coding agent: relevant defaults, product choices, failure checks and evidence, with clear coverage limits.",
    url: "/docs/security-planning",
    images: [{ url: "/og-plannable.png", width: 1200, height: 630, alt: "Plannable execution workflow" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Security planning for AI-built software",
    description:
      "Plan practical safeguards with your AI coding agent: relevant defaults, product choices, failure checks and evidence, with clear coverage limits.",
    images: ["/og-plannable.png"]
  }
};

export default function SecurityPlanningPage() {
  return (
    <DocsPage
      eyebrow="Planning safeguards"
      title="Plan the protection before writing the feature."
      summary="Describe what your app should do. Plannable gives the agent a place to turn applicable safeguards into development tasks and checks, inside the existing planning workflow."
    >
      <p className="callout">
        These instructions describe the unreleased guidance in this source version. Published installs may not yet
        include it. Planning checks do not prove an application is secure.
      </p>
      <h2>What is included without a security request?</h2>
      <p>
        Every new CLI draft includes secret handling and checks for changed behavior. When the project declares
        dependencies, it also includes a dependency and configuration review. The agent then inspects the actual project
        and enriches the active part with relevant rules.
      </p>
      <p>
        For example, confirmed private customer records call for permission checks on every read and write. A product
        name or an installed authentication package alone does not establish who should have access. An app without
        accounts should not gain a login system just to satisfy a checklist.
      </p>
      <h2>What does the owner still decide?</h2>
      <p>
        You decide who may see or change information, what may be shared publicly, and how long information should be
        kept. The agent handles routine technical choices using the actual stack’s current documentation. It should not
        ask whether you want secrets protected.
      </p>
      <p>
        If you say “not sure who should see these records,” the agent records the open decision and pauses affected work
        before exposing them. It can continue unrelated work. Uncertainty is not permission to publish or delete data.
      </p>
      <h2>What belongs in each development part?</h2>
      <ol>
        <li>
          <strong>Reason:</strong> the observed fact or owner decision that makes a rule relevant.
        </li>
        <li>
          <strong>Action:</strong> a concrete safeguard in the existing constraints and tasks.
        </li>
        <li>
          <strong>Checks:</strong> an unwanted action fails and the intended action still works.
        </li>
        <li>
          <strong>Evidence:</strong> the actual result, changed path, artifact and any untested limits.
        </li>
      </ol>
      <p>
        <Link href="/examples/private-customer-app">See the private customer app example</Link> for an ownership
        requirement and its failure checks.
      </p>
      <h2>Coverage and limits</h2>
      <p>
        Six small modules cover baseline hygiene, access, stored data, external input, services and code quality.
        Conditional guidance includes uploads, fetched URLs, sessions, integration events, resource limits and
        accessible interaction. Only applicable rules belong in the active part.
      </p>
      <p>
        This is a starter set, not a vulnerability scanner, complete threat model, compliance assessment or security
        certification. Sensitive or regulated systems may need specialist review. <code>plannable verify</code> checks
        plan structure and tagged rule coverage; it does not execute application security tests or establish that
        evidence is true.
      </p>
      <p>
        Guidance adds context. Local fixtures check selection, preserved requirements and missing mappings. Illustrative
        control tests are not proof of better agent-generated applications. A repeated-model comparison and
        non-technical participant pilot remain pending; no measured improvement in user burden or security outcomes is
        claimed.
      </p>
      <h2>Sources and maintenance</h2>
      <p>
        Module sources were reviewed on September 17, 2026. Guidance draws on the{" "}
        <a href="https://cheatsheetseries.owasp.org/">OWASP Cheat Sheet Series</a>,{" "}
        <a href="https://csrc.nist.gov/pubs/sp/800/218/final">NIST SSDF</a> and{" "}
        <a href="https://www.w3.org/WAI/WCAG22/quickref/">WCAG 2.2</a>. These sources do not certify Plannable or
        replace documentation for your framework.
      </p>
      <p>
        Contributors can propose one focused rule with its source, applicability, positive and negative checks, and
        review date. The{" "}
        <a href="https://github.com/suntay44/Plannable/blob/main/docs/GUIDANCE.md">guidance contract</a> explains
        revisions and regression fixtures. Start with the <Link href="/docs/getting-started">installation guide</Link>;
        commands and completion flow stay the same.
      </p>
    </DocsPage>
  );
}
