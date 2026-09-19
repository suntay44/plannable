import { siteOrigin as origin } from "../_lib/site-origin";

export function GET() {
  const content = `# Plannable

> Evidence-gated implementation planning for AI coding agents.

Plannable is an MIT-licensed TypeScript CLI and open agent skill. It creates a short MASTER_PLAN.md plus compact PlannablePlan .ai.md parts. Agents load one part at a time. A part cannot be marked complete until substantive evidence is recorded.

The unreleased source guidance adds practical security and code-quality requirements to the existing workflow. Guidance and evidence presence do not prove application security.

## Documentation
- Getting started: ${origin}/docs/getting-started
- Commands: ${origin}/docs/commands
- PlannablePlan format: ${origin}/concepts/plannableplan
- Comparison with spec-kit: ${origin}/compare/spec-kit
- Planning safeguards: ${origin}/docs/security-planning
- Customer app example: ${origin}/examples/private-customer-app
- FAQ: ${origin}/faq
- Source: https://github.com/suntay44/Plannable
`;
  return new Response(content, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
