# quality guidance (revision 1)

Reviewed: 2026-09-17. Sources inform original guidance; no certification is implied.

## quality.change
Applies: every active part. Otherwise inspect uncertain scope; do not introduce the feature.
C: [quality.change] Preserve conventions and existing behavior.
T: [quality.change] Handle failures and test changed behavior.
AC: [quality.change] Failure is understandable; the intended outcome still works.
V: [quality.change] Run relevant project checks; distinguish passed from unavailable.

## quality.ui
Applies: only when ui is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [quality.ui] Preserve accessible interaction.
T: [quality.ui] Use semantic controls and actionable form errors.
AC: [quality.ui] Keyboard use and error recovery work alongside normal interaction.
V: [quality.ui] Check affected controls with keyboard and invalid/valid input.

Sources:
- https://www.w3.org/WAI/WCAG22/quickref/
- https://csrc.nist.gov/pubs/sp/800/218/final
