# data guidance (revision 1)

Reviewed: 2026-09-17. Sources inform original guidance; no certification is implied.

## data.recovery
Applies: only when storedData is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [data.recovery] Minimize stored data and redact sensitive errors.
T: [data.recovery] Define retention/recovery; preserve data on failed changes.
AC: [data.recovery] Failed changes preserve data; sensitive errors are redacted; valid changes work.
V: [data.recovery] Use disposable data to check failure, redaction and recovery.

Sources:
- https://cheatsheetseries.owasp.org/cheatsheets/User_Privacy_Protection_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Database_Security_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Logging_Cheat_Sheet.html
