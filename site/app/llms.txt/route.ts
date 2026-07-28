export function GET(request: Request) {
  const origin = new URL(request.url).origin;
  const content = `# Plannable

> Evidence-gated implementation planning for AI coding agents.

Plannable is an MIT-licensed TypeScript CLI and open agent skill. It creates a short MASTER_PLAN.md plus compact PlannablePlan .ai.md parts. Agents load one part at a time. A part cannot be marked complete until substantive evidence is recorded.

## Documentation
- Getting started: ${origin}/docs/getting-started
- Commands: ${origin}/docs/commands
- PlannablePlan format: ${origin}/concepts/plannableplan
- Comparison with spec-kit: ${origin}/compare/spec-kit
- FAQ: ${origin}/faq
- Source: https://github.com/suntay44/Plannable
`;
  return new Response(content, { headers: { "content-type": "text/plain; charset=utf-8" } });
}
