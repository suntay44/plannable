@PlannablePlan v0.1

ID=PART-003
PH=DISCOVERY
SCN=SCN-003
OUT=Public documentation explains and demonstrates the shipped capability
DEP=[PART-002]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion; S=stop

G:
- Help newcomers discover and use released planning guidance with accurate examples and clear limits.

CTX:
- product: security and code-quality guidance inside the existing compact planning workflow
- phase: 3/3; prior prerequisite: integrated/tested guidance from PART-002; confirm evidence, not other part files
- next: maintain guidance and measure adoption; detail: DISCOVERY.md, VALIDATION.md and SOURCES.md
- initiative cwd: docs/initiatives/security-aware-planning; repo root: ../../..; F paths below are repo-relative
- observed: root discovery part pending; latest unauthenticated HTTP 401; read-only Sites inspection reports owner-only custom access

C:
- Preserve routes and commands; no redesign, hosted workflow, certification or ranking guarantee.
- Capability claims follow tested releases; do not fabricate search-volume data.
- Public deployment/access changes, account setup and telemetry require relevant explicit authorization.

F:
? README.md, docs/WORKFLOWS.md, docs/INSTALL.md
? site/app/page.tsx, site/app/layout.tsx, site/app/docs/getting-started/page.tsx, site/app/faq/page.tsx
+ site/app/docs/security-planning/page.tsx
+ site/app/examples/private-customer-app/page.tsx
? site/app/sitemap.xml/route.ts, site/app/llms.txt/route.ts, site/app/_components/site-chrome.tsx
? site/tests/rendered-html.test.mjs, CONTRIBUTING.md

T:
1 Explain agent-owned defaults, the few owner product choices, “not sure” behavior and residual risks using shipped examples; align site/README installation with tested source/platform methods.
2 Add two substantive pages from DISCOVERY.md; update existing homepage/FAQ with plain-language answers, reviewed sources and internal links.
3 Align visible claims, metadata/OG, SoftwareSourceCode descriptions, sitemap/llms links and production canonicals; distinguish plan validation from application security testing.
4 Run rendered-route tests, mobile/keyboard/manual language QA and exact published-artifact smoke tests after release authorization.
5 Verify production pages and crawler resources without login after authorized public deployment; coordinate root launch evidence without falsely completing it.
6 Record Search Console/adoption baseline when authorized access exists; define 30/60/90-day comparisons, treating rankings and AI citations as observations.

AC:
- Examples start with requests that never mention security; relevant safeguards still appear without technical questions. Users distinguish planned defaults, actually passed checks and unresolved decisions.
- Claims about reduced burden or better outcomes cite the Part 2 comparison/pilot and its limitations; absent evidence leaves those claims unpublished.
- Old clone snippets match reviewed install docs; commands match the installed artifact and supported launchers.
- Existing/new routes have truthful unique metadata, useful visible answers and working links/canonicals; structured data reflects content.
- Unauthenticated production pages and crawler routes are accessible on the canonical host; local rendering is not substituted for this check.
- No claim promises secure code, standards compliance, rankings or an AI-engine preference for llms.txt.
- Coverage limits, measurement methods and contribution/review steps are visible.

V:
- From initiative cwd: npm --prefix ../../.. run check
- From initiative cwd: npm --prefix ../../../site run lint
- From initiative cwd: npm --prefix ../../../site test
- Record fresh unauthenticated production status/HTML/canonical/robots/sitemap checks and exact released install artifact.

DONE:
- In initiative PLAN_EVIDENCE.md record paths, release/version, site tests and actual live-access results for PART-003.
- From initiative cwd run node ../../../dist/cli.js complete PART-003 only after evidence; then node ../../../dist/cli.js verify.

S:
- If deployment stays private or release unavailable, prepare local content but leave public readiness pending.
- Do not remove authentication or publish roadmap promises as working features to meet SEO targets.
