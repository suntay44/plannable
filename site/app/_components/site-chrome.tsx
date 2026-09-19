import Link from "next/link";

const navItems = [
  { href: "/docs/getting-started", label: "Get started" },
  { href: "/docs/commands", label: "Commands" },
  { href: "/docs/security-planning", label: "Safeguards" },
  { href: "/concepts/plannableplan", label: "Format" },
  { href: "/compare/spec-kit", label: "Compare" },
  { href: "/faq", label: "FAQ" }
];

export function Mark() {
  return (
    <span className="mark" aria-hidden="true">
      <span />
      <span />
      <span />
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <Link className="brand" href="/" aria-label="Plannable home">
          <Mark />
          <span>Plannable</span>
        </Link>
        <nav className="main-nav" aria-label="Primary navigation">
          {navItems.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
        <a className="button button-small button-dark" href="https://github.com/suntay44/Plannable">
          View on GitHub
        </a>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link className="brand" href="/">
            <Mark />
            <span>Plannable</span>
          </Link>
          <p>Evidence-gated implementation planning for AI coding agents.</p>
        </div>
        <div>
          <p className="eyebrow">Explore</p>
          <Link href="/docs/getting-started">Getting started</Link>
          <Link href="/docs/commands">Command reference</Link>
          <Link href="/docs/security-planning">Planning safeguards</Link>
          <Link href="/examples/private-customer-app">Customer app example</Link>
          <Link href="/faq">FAQ</Link>
        </div>
        <div>
          <p className="eyebrow">Project</p>
          <a href="https://github.com/suntay44/Plannable">GitHub</a>
          <a href="https://github.com/suntay44/Plannable/blob/main/CHANGELOG.md">Changelog</a>
          <a href="https://github.com/suntay44/Plannable/blob/main/LICENSE">MIT license</a>
        </div>
      </div>
    </footer>
  );
}
