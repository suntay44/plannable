# access guidance (revision 1)

Reviewed: 2026-09-17. Sources inform original guidance; no certification is implied.

## access.owner
Applies: only when privateData is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [access.owner] Enforce record permissions at the trusted boundary.
T: [access.owner] Reuse ownership checks for each private read/write.
AC: [access.owner] Wrong-owner requests fail; permitted requests work, including direct requests.
V: [access.owner] Test both owners and denied writes; record actual results.

## access.login
Applies: only when accounts is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [access.login] Reuse maintained authentication; do not invent crypto.
T: [access.login] Inspect and reuse supported sign-in and session handling.
AC: [access.login] Invalid credentials fail; legitimate sign-in works.
V: [access.login] Test invalid and valid sign-in with disposable accounts.

## access.session
Applies: only when browserSession is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [access.session] Protect sessions and state changes for the actual auth design.
T: [access.session] Use supported session expiry/logout and applicable CSRF defenses.
AC: [access.session] Expired or forged session actions fail; valid actions work.
V: [access.session] Test session expiry and cross-origin state changes using stack guidance.

Sources:
- https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html
