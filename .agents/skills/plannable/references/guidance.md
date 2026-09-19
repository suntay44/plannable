# Planning safeguards

Generated from templates/guidance; edit the source, not this mirror.

Handle routine safeguards without asking whether they are wanted. Inspect technical facts first; ask only unresolved product choices (access, sharing, retention, exposure, cost). Not sure is not approval for risky work.

Select applicable baseline rules and quality.change. Reuse current-revision rules already inline; load module text only to add, refresh or resolve a rule. Do not infer scope from the product name or package presence alone. Unknown is not absent. Preserve explicit exclusions and existing behavior.

- [baseline](./baseline.md): baseline.secrets (always), baseline.dependencies (dependencies)
- [access](./access.md): access.owner (privateData), access.login (accounts), access.session (browserSession)
- [data](./data.md): data.recovery (storedData)
- [input](./input.md): input.boundary (externalInput), input.files (files), input.urls (outboundUrls)
- [services](./services.md): services.events (incomingEvents), services.resources (publicService)
- [quality](./quality.md): quality.change (always), quality.ui (ui)

## Existing v0.1 blocks

CTX: - guidance: v1; rules=baseline.secrets@1,quality.change@1
CTX: - basis[baseline.secrets]: routine default
Add basis for each rule and [rule.id] text in C, T, AC, V. Keep required actions inline; IDs alone are insufficient. For uncertain context, CTX: - decision[feature]: inspect or ask; add the relevant S stop condition.

Before coding, match applicable IDs to constraints/actions and positive/negative acceptance/checks. Reassess on scope changes; keep later implications in MASTER_PLAN without loading all parts. Resolve risky unknowns before affected work, preserving part order.

Evidence: rule ID; changed path; actual command/manual check; observed result; artifact; limits. Planned, implemented, passed and unavailable differ. Never label unavailable checks passed. verify/complete check plan structure/evidence presence, not application security. Explain planned safeguards, passed checks and unresolved items briefly to the owner.
