# SEO/AEO: earn trust through usable planning examples

Proposed positioning, to publish only when implemented: **“Open-source planning for AI-built software, with practical security and code-quality guidance.”** Supporting explanation: “Describe your idea in plain language. Your agent plans routine safeguards for you and explains the product decisions that need your input. Each development part carries concrete checks.” Token efficiency remains a benefit with measured limits.

## Public access and honest claims

Root evidence describes a private deployment; an unauthenticated fetch on 2026-09-17 returned HTTP 403. Final local review found owner-only custom access through read-only Sites inspection; a later unauthenticated fetch returned HTTP 401. Public discovery is still unavailable. Verify public access before launch; do not remove authentication as an SEO workaround. Public publishing/access changes are a separate decision.

Homepage/getting-started source now uses guarded clone/install commands aligned with the reviewed repository install guide. The local content is prepared but not deployed. Keep platform launch syntax and CLI-versus-skill prerequisites visible.

Google says AI search features use the same SEO foundations, without special AI schema or required AI text files. Keep `llms.txt` as an optional consistent summary, not a promised ranking mechanism. Public access and compliant markup do not guarantee indexing, citations, or ranking. [Google guidance](https://developers.google.com/search/docs/appearance/ai-features)

## Small content set with distinct purposes

| Surface | User question and content | Proof/link |
| --- | --- | --- |
| Existing homepage/README | “How do I plan an app before asking AI to build it?” Audience, unchanged workflow and shipped guidance. | Readable before/after requirement and getting-started link |
| Existing getting started | “Do I need to know which security questions to ask?” Show automatic defaults, the few product choices, and a “not sure” example. Keep realistic setup prerequisites. | Same plain-language request before/after, with observed tests separate from planned safeguards |
| Proposed `/docs/security-planning` | “What should my AI coding plan include for security?” Facts → applicable rule → failure case → evidence. | Coverage, sources, review date and limits |
| Proposed `/examples/private-customer-app` | “How do I keep one customer's data away from another?” Ownership and direct-request failure checks. | Tested fixture output and legitimate success case |
| Existing FAQ | “What does the agent handle automatically?” “What do I still decide?” “Does verify audit my code?” “What if I don't know the stack?” | Distinguish planned protection, actual tests, limits and independent review |

Explain a short result summary: defaults included, checks actually passed and unresolved items. Never tell beginners they can stop thinking about product access or that all vulnerabilities are handled. Write useful answers first, then examples and sources. These are editorial query hypotheses, not researched search-volume claims. Avoid duplicate keyword pages, unsupported “OWASP certified” claims, guaranteed security, or promises that evidence text proves a test passed.

## Integration and acceptance

- Update titles/descriptions/OG and `WebSite`/`SoftwareSourceCode` descriptions only for shipped functionality. Structured data must match visible content; no fabricated ratings or certification. [Google policies](https://developers.google.com/search/docs/appearance/structured-data/sd-policies)
- Preserve routes/layout. Add substantive docs/examples with unique canonicals, navigation links and sitemap entries. Keep production host configuration consistent between page canonicals and crawler routes; preview/local tests alone are insufficient.
- Verify rendered HTML, status, robots directives, canonicals, sitemap links and readable content without login. Check mobile layout, keyboard use and understandable language. Crawler endpoints returning 200 do not compensate for gated pages.
- Align `llms.txt`, README, examples and release docs with the installed CLI; record example artifact versions. Publish capability claims after the related Git/package release is usable.

## Adoption and maintenance

After authorized public release, establish a Search Console baseline and compare at 30/60/90 days: indexed pages, impressions/clicks for intended questions, and referrers where available. Record dated/manual AI-answer observations separately; Google combines AI-feature traffic with general Web performance, so do not label all growth “AEO.” Set targets after collecting a baseline, not invented forecasts.

Use voluntary issues and the non-technical pilot to find confusing decisions. No project-plan or agent telemetry is needed. Add contributor instructions for one reviewed module and example at a time; publish scope, sources and limits to establish open-source trust.
