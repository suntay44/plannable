@PlannablePlan v0.1

ID=PART-002
PH=PUBLIC_LAUNCH_HARDENING
SCN=SCN-002
OUT=Release and maintenance automation works
DEP=[PART-001]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- Maintainer releases with confidence

CTX:
- product: Plannable — command-driven planning skill and TypeScript CLI for AI coding agents
- phase: Public Launch Hardening (part 2/3)
- prior: PART-001 delivered safe project paths, atomic writes, truthful state verification, and substantive evidence
- next: PART-003 covers "SEO/AEO discovery surface works"

C:
- preserve-existing-work
- avoid-unrelated-edits
- ask-before-new-deps

F:
+ package.json
+ package-lock.json
+ .github/workflows/*
+ .github/dependabot.yml
+ scripts/check-package.mjs
+ src/core/templates.ts
+ src/core/scenario-hints/*
+ tests/*
+ README.md
+ docs/INSTALL.md
+ CONTRIBUTING.md
? CHANGELOG.md

T:
1 modernize:Node minimum and development dependencies; clear all fixable audit findings
2 automate:CI across supported Node and operating-system combinations
3 safeguard:npm package contents, prepack build, provenance-ready release workflow, and dependency updates
4 enforce:lint, formatting, package smoke tests, and unknown-option errors
5 refactor:split the scenario hint catalog into small domain modules without behavior changes
6 document:supported runtime, release process, and maintenance policy

AC:
- supported Node versions are explicit and exercised in CI.
- `npm audit` reports no known vulnerabilities.
- the packed artifact includes required CLI/skill files and excludes local settings.
- CI runs typecheck, lint, formatting, tests, build, and package validation.
- npm publishing is gated by validation and prepared for provenance.
- scenario hints are split into focused files and existing generated-plan tests still pass.
- unknown CLI options fail with an actionable message.

V:
- npm run check
- npm audit
- npm pack --dry-run --json

DONE:
- update MASTER_PLAN.md Part 2=[x]
- append PLAN_EVIDENCE.md#PART-002 with files+checks+notes
- run plannable repair to regenerate PLAN_STATE.md, or update current_part=PART-003

S:
- preserve zero runtime dependencies
- do not publish to npm without explicit release credentials and registry approval
