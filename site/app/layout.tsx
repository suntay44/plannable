import type { Metadata } from "next";
import { SiteFooter, SiteHeader } from "./_components/site-chrome";
import { siteOrigin } from "./_lib/site-origin";
import "./globals.css";


export const metadata: Metadata = {
  metadataBase: new URL(siteOrigin),
  title: {
    default: "Plannable — Evidence-gated plans for AI coding agents",
    template: "%s | Plannable"
  },
  description:
    "Plannable turns a product idea into small implementation parts that AI coding agents execute one at a time, with evidence required before completion.",
  applicationName: "Plannable",
  keywords: [
    "AI coding agent planning",
    "implementation planning",
    "Codex skill",
    "Claude Code skill",
    "Cursor skill",
    "PlannablePlan"
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Plannable",
    title: "Plannable — Plans AI coding agents can actually finish",
    description: "One part at a time. Evidence before completion. Zero runtime dependencies.",
    url: "/",
    images: [{ url: "/og-plannable.png", width: 1200, height: 630, alt: "Plannable execution workflow" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Plannable — Plans AI coding agents can actually finish",
    description: "One part at a time. Evidence before completion. Zero runtime dependencies.",
    images: ["/og-plannable.png"]
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg"
  }
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: "Plannable",
      url: siteOrigin,
      description: "Documentation for evidence-gated implementation planning with AI coding agents, including unreleased security planning guidance."
    },
    {
      "@type": "SoftwareSourceCode",
      name: "Plannable",
      codeRepository: "https://github.com/suntay44/Plannable",
      programmingLanguage: "TypeScript",
      runtimePlatform: "Node.js 22 or newer",
      license: "https://opensource.org/license/mit",
      description:
        "A command-driven planning skill and CLI with compact parts and evidence before completion. Unreleased source guidance adds applicable security and code-quality requirements."
    }
  ]
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replaceAll("<", "\\u003c") }}
        />
      </body>
    </html>
  );
}
