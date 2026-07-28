@PlannablePlan v0.1

ID=PART-003
PH=PUBLIC_LAUNCH_HARDENING
SCN=SCN-003
OUT=SEO/AEO discovery surface works
DEP=[PART-002]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- Developer discovers and understands Plannable

CTX:
- product: Plannable — command-driven planning skill and TypeScript CLI for AI coding agents
- phase: Public Launch Hardening (part 3/3)
- prior: safe project files plus validated release and maintenance automation
- next: COMPLETE — run the full repository and deployed-site verification

C:
- visible answer-first content must match CLI behavior
- do not claim special AEO ranking or unsupported integrations
- preserve the starter hosting runtime and package manager
- use one bespoke generated social card after copy is stable

F:
+ site/app/*
+ site/components/*
+ site/public/*
+ site/tests/*
+ site/.openai/hosting.json
+ README.md
+ package.json
+ docs/*

T:
1 build:indexable home page with concise product answer, workflow, proof, integrations, and primary actions
2 publish:answer-first routes for getting started, commands, PlannablePlan, spec-kit comparison, and FAQ
3 implement:unique metadata, canonical URLs, JSON-LD, sitemap, robots, social card, semantic HTML, and internal links
4 align:README, package metadata, and public site messaging
5 validate:build, rendered HTML assertions, browser accessibility, responsive layouts, navigation, and crawler files
6 review:remove starter artifacts, unsupported claims, broken links, metadata gaps, and mobile overflow
7 publish:private production deployment through Sites and inspect the live result

AC:
- every public route answers its primary question in the opening content.
- each indexable page has a unique title, description, canonical, and internal navigation.
- WebSite and SoftwareSourceCode structured data are valid JSON and reflect visible content.
- robots.txt and sitemap.xml are reachable and reference the production origin.
- mobile and desktop layouts have no blocking accessibility or navigation defects.
- the deployed production site returns the intended Plannable content.

V:
- npm run lint
- npm test
- browser QA at desktop and mobile widths
- inspect rendered metadata, JSON-LD, robots.txt, and sitemap.xml
- inspect production deployment

DONE:
- update MASTER_PLAN.md Part 3=[x]
- append PLAN_EVIDENCE.md#PART-003 with files+checks+screenshots+production URL
- set current_part=COMPLETE

S:
- do not publish the npm package
- stop if hosting requires a credential not supplied through Sites
