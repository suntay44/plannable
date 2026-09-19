# MASTER_PLAN.md

## Product Goal
Give non-technical owners practical baseline security and code-quality planning without requiring them to know which technical safeguards to request. Agents select relevant defaults, ask only necessary product questions, and carry testable requirements into development. Keep Plannable's commands, three-part draft, one-part loading, v0.1 format, and evidence workflow.

Status: local implementation and automated validation finished, 2026-09-17. Part 1 is complete; Part 2 remains open for the participant/model evaluations, and Part 3 for publication and public-access validation. See VALIDATION_RESULTS.md for 77 CLI tests, 11 site tests and installation results. This initiative is separate from the existing root launch plan.

## Product Scenarios

### SCN-001: An owner gets safeguards without a security questionnaire
Outcome: Routine safeguards are selected with minimal user input
The agent includes applicable technical defaults, inspects existing context, and asks only unresolved product questions. Owners do not have to request secret protection, input safety or permission checks.

### SCN-002: A coding agent receives actionable requirements
Outcome: Existing plans carry testable security and quality guidance
Each affected part includes relevant constraints, failure cases, checks, and stop conditions using the existing blocks and completion workflow.

### SCN-003: A newcomer finds and trusts Plannable
Outcome: Public documentation explains and demonstrates the shipped capability
Searchable examples show how planning guides safer implementation, with accurate sources, working installation steps, and explicit limits.

## Phase 1: Modular Defaults

- [x] Part 1: Read `plans/PART1_PLAN.ai.md`
  - Scenario: SCN-001
  - Outcome: Routine safeguards are selected with minimal user input
  - Evidence: recorded

## Phase 2: Existing Workflow Integration

- [ ] Part 2: Read `plans/PART2_PLAN.ai.md`
  - Scenario: SCN-002
  - Outcome: Existing plans carry testable security and quality guidance
  - Evidence: recorded

## Phase 3: Trustworthy Discovery

- [ ] Part 3: Read `plans/PART3_PLAN.ai.md`
  - Scenario: SCN-003
  - Outcome: Public documentation explains and demonstrates the shipped capability
  - Evidence: recorded

## Planning Decisions

- Start with six first-party guidance modules and concrete minimum coverage in DEFAULTS.md. Technical safeguards are agent responsibilities; unknown product intent stays explicit. A project label is not proof of architecture.
- Keep applicable safeguards on by default during enrichment. Put decisions briefly in the master and concrete requirements in affected parts; refresh applicability when scope changes. Planned, implemented and tested remain distinct.
- Implementation order: library and fixtures → integration and compatibility → release-backed documentation. Public deployment remains a separate authorized action.

## Supporting Notes

- [Design and worked example](DESIGN.md)
- [Agent-owned defaults and decision rules](DEFAULTS.md)
- [Acceptance matrix](VALIDATION.md)
- [SEO/AEO content and release plan](DISCOVERY.md)
- [Official references and observed repository facts](SOURCES.md)
- [Second-review findings and resolutions](REVIEW.md)
