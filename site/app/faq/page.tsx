import type { Metadata } from "next";
import Link from "next/link";
import { DocsPage } from "../_components/docs-page";

export const metadata: Metadata = {
  title: "Frequently asked questions",
  description:
    "Direct answers about Plannable, evidence-gated completion, supported AI coding agents, installation, safety, and PlannablePlan.",
  alternates: { canonical: "/faq" }
};

const faqs = [
  [
    "What is Plannable?",
    "Plannable is a command-driven planning skill and TypeScript CLI for AI coding agents. It creates a short human master plan and compressed agent-readable parts, then requires evidence before a part can be marked complete."
  ],
  [
    "Which AI coding agents does it support?",
    "The repository ships skill instructions for Codex, Claude Code, and Cursor. The terminal CLI works anywhere Node.js 22 or newer is available. Platform launch syntax differs, so the docs do not promise identical slash-command behavior everywhere."
  ],
  [
    "Why does completion require evidence?",
    "Evidence makes progress reviewable across sessions. A part needs a substantive artifact, changed file, check, note, or explicit unavailable reason before completion can update the master plan."
  ],
  [
    "Does Plannable send my plan to a hosted service?",
    "No hosted Plannable service is required for the CLI. It reads and writes project-local planning files. Your coding agent or development platform may have its own data handling policy."
  ],
  [
    "Can a plan file read or write outside my project?",
    "Project plan paths are confined to the working project. Existing targets are checked through their real paths, symbolic-link writes are refused, and plan overwrites use atomic file replacement."
  ],
  [
    "Is PlannablePlan an encoded format?",
    "No. PlannablePlan is compact, semantic plain text. It avoids binary, base64, and gzip as the default planning format so agents and people can still inspect it."
  ],
  [
    "Is the npm package available?",
    "The package and provenance-ready release workflow are prepared. Until an approved npm release is published, install the CLI from the GitHub source."
  ],
  [
    "How is this different from a checklist?",
    "A Plannable part carries context, ordered tasks, acceptance criteria, verification guidance, completion updates, and stop conditions. Its completion state is also checked against an evidence log."
  ]
];

export default function FaqPage() {
  return (
    <DocsPage
      eyebrow="FAQ"
      title="Answers before you hand over the keyboard."
      summary="Plannable is local, text-based, evidence-gated, and designed for focused agent execution. Here are the practical details."
    >
      <h2>Frequently asked questions</h2>
      <dl className="faq-list">
        {faqs.map(([question, answer]) => (
          <div className="faq-item" key={question}>
            <dt>{question}</dt>
            <dd>{answer}</dd>
          </div>
        ))}
      </dl>
      <h2>Still deciding?</h2>
      <p>
        Read the <Link href="/compare/spec-kit">spec-kit comparison</Link>, inspect the{" "}
        <Link href="/concepts/plannableplan">part format</Link>, or{" "}
        <a href="https://github.com/suntay44/Plannable">review the source on GitHub</a>.
      </p>
    </DocsPage>
  );
}
