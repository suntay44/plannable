import type { Metadata } from "next";
import Link from "next/link";
import { CodeBlock, DocsPage } from "../../_components/docs-page";

export const metadata: Metadata = {
  title: "Example: plan a private customer app",
  description:
    "Turn a plain-language customer app idea into record ownership requirements, allowed and denied request tests, and honest evidence.",
  alternates: { canonical: "/examples/private-customer-app" },
  openGraph: {
    title: "Example: plan a private customer app",
    description:
      "Turn a plain-language customer app idea into record ownership requirements, allowed and denied request tests, and honest evidence.",
    url: "/examples/private-customer-app",
    images: [{ url: "/og-plannable.png", width: 1200, height: 630, alt: "Plannable execution workflow" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Example: plan a private customer app",
    description:
      "Turn a plain-language customer app idea into record ownership requirements, allowed and denied request tests, and honest evidence.",
    images: ["/og-plannable.png"]
  }
};

export default function PrivateCustomerAppPage() {
  return (
    <DocsPage
      eyebrow="Worked planning example"
      title="Keep one customer’s records away from another."
      summary="Start with “Build an app where customers can view and update their own service requests.” No security terminology is needed in that request."
    >
      <p className="callout">
        This is an illustrative enrichment using the unreleased guidance. The CLI creates a draft; the agent must
        inspect and enrich it. It does not build or audit this application automatically.
      </p>
      <h2>Clarify the product decision</h2>
      <p>
        Ask who can read or change a service request. Suppose the owner confirms that each customer can access only
        their own requests and staff access is outside the current scope. Record that decision briefly in the master
        plan. Do not invent staff roles or sharing features.
      </p>
      <h2>Strengthen the active part</h2>
      <p>
        “Customers can edit requests” leaves a critical question unanswered. Add an ownership constraint, an
        implementation task and both allowed and denied checks. The excerpt below shows one rule; keep other applicable
        defaults and scenario requirements in the part.
      </p>
      <CodeBlock>{`CTX:
- guidance: v1; rules=access.owner@1
- basis[access.owner]: owner confirmed customer-only records
C:
- [access.owner] Enforce record permissions at the trusted boundary.
T:
- [access.owner] Reuse ownership checks for each private read/write.
AC:
- [access.owner] Wrong-owner requests fail; permitted requests work, including direct requests.
V:
- [access.owner] Test both owners and denied writes; record actual results.`}</CodeBlock>
      <h2>Check the behavior, including direct requests</h2>
      <ol>
        <li>Create two disposable customers, A and B, with different records.</li>
        <li>Confirm A can read and update A’s record.</li>
        <li>Request B’s record directly as A. Confirm neither its contents nor an unauthorized update is allowed.</li>
        <li>Confirm the denied update did not change B’s record and B can still use it.</li>
      </ol>
      <p>
        Hiding a button is insufficient: checks must reach the trusted data boundary. Use your framework’s maintained
        authorization mechanisms. See the{" "}
        <a href="https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html">
          OWASP authorization guidance
        </a>
        .
      </p>
      <h2>Report what was actually validated</h2>
      <p>
        <strong>Planned:</strong> ownership checks for private reads and writes. <strong>Observed locally:</strong>{" "}
        Plannable’s illustrative fixture distinguishes a denied cross-owner request from a deliberately disabled
        control. <strong>Still required:</strong> implement and test those checks against your actual application,
        including its database and session handling.
      </p>
      <p>
        The fixture is not a generated customer app and does not establish that an agent will implement the rule
        correctly. Record real application results with the existing <code>plannable evidence</code> command before
        completion. Label unavailable checks explicitly.
      </p>
      <p>
        Review <Link href="/docs/security-planning">coverage and limitations</Link> or follow the{" "}
        <Link href="/docs/getting-started">existing workflow</Link>.
      </p>
    </DocsPage>
  );
}
