import type { ReactNode } from "react";

export function DocsPage({
  eyebrow,
  title,
  summary,
  children
}: {
  eyebrow: string;
  title: string;
  summary: string;
  children: ReactNode;
}) {
  return (
    <main id="main" className="docs-main">
      <article className="shell article">
        <header className="article-header">
          <p className="eyebrow">{eyebrow}</p>
          <h1>{title}</h1>
          <p className="lede">{summary}</p>
        </header>
        <div className="article-body">{children}</div>
      </article>
    </main>
  );
}

export function CodeBlock({ children }: { children: ReactNode }) {
  return (
    <pre className="code-block">
      <code>{children}</code>
    </pre>
  );
}
