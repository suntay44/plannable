# Token Benchmark: Plannable vs spec-kit

What does an agent have to load into context for **one implementation step**?

Measured 2026-07-05. Token estimates use the same method for both tools: `bytes / 4`
(the `estimateTokens` heuristic Plannable uses internally).

## Result

| Context loaded per implementation step | Bytes | ~Tokens |
| --- | --- | --- |
| spec-kit: spec + plan + tasks + constitution (empty templates) | 19,875 | ~4,969 |
| Plannable: one generated part file (`plans/PART1_PLAN.ai.md`) | 1,329 | ~332 |
| Plannable: part file + `MASTER_PLAN.md` orientation | 2,166 | ~541 |

**~15x less context per step** (~9x if the agent also reads the master plan).

## Why this is a lower bound in spec-kit's favor

The spec-kit numbers are its **empty templates** — the skeletons before an agent
fills them. The real `spec.md`, `plan.md`, and `tasks.md` an agent loads at
`/speckit.implement` time are strictly larger than their templates. The Plannable
numbers are **actual generated output**, ready to execute.

## What this does not measure

- Specification depth: spec-kit's artifacts carry more governance detail
  (constitution, clarification history). If you need that depth, the extra
  tokens buy something.
- One-time costs: both tools have setup/create steps outside the per-step loop.
- Model behavior: fewer tokens per step means less context rot in long sessions,
  but this benchmark counts tokens, not outcomes.

## Reproduce it

spec-kit side:

```bash
mkdir speckit-bench && cd speckit-bench
for f in spec-template.md plan-template.md tasks-template.md constitution-template.md; do
  curl -sLO "https://raw.githubusercontent.com/github/spec-kit/main/templates/$f"
done
wc -c *.md   # sum, then divide by 4
```

Plannable side:

```bash
mkdir plannable-bench && cd plannable-bench
plannable create "CRM"
wc -c plans/PART1_PLAN.ai.md MASTER_PLAN.md   # divide by 4
plannable run-next   # also prints the part's token estimate directly
```

Both plans describe the same product idea (a CRM). Sizes vary a little by product
domain; the ratio does not change materially.
