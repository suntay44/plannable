# baseline guidance (revision 1)

Reviewed: 2026-09-17. Sources inform original guidance; no certification is implied.

## baseline.secrets
Applies: every active part. Otherwise inspect uncertain scope; do not introduce the feature.
C: [baseline.secrets] Keep secrets out of source, plans and logs.
T: [baseline.secrets] Use placeholders and existing secret configuration.
AC: [baseline.secrets] A fake secret stays out of changed public outputs; valid config works.
V: [baseline.secrets] Check changed outputs with a fake secret; record results.

## baseline.dependencies
Applies: only when dependencies is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [baseline.dependencies] Preserve protections; avoid blind dependency upgrades.
T: [baseline.dependencies] Review changed dependencies/config and dev/production differences.
AC: [baseline.dependencies] Changes preserve required behavior; unresolved advisories are recorded.
V: [baseline.dependencies] Review lock/config diff and run relevant existing checks.

Sources:
- https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Vulnerable_Dependency_Management_Cheat_Sheet.html
