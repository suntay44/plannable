# services guidance (revision 1)

Reviewed: 2026-09-17. Sources inform original guidance; no certification is implied.

## services.events
Applies: only when incomingEvents is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [services.events] Keep credentials trusted; verify incoming events.
T: [services.events] Use provider docs for authenticity, retries and duplicate handling.
AC: [services.events] Forged/duplicate events cannot repeat side effects; valid events work.
V: [services.events] Test fake and repeated events using provider fixtures; record limitations.

## services.resources
Applies: only when publicService is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [services.resources] Bound costly work and verify production transport/config.
T: [services.resources] Reuse suitable request/resource limits; inspect deployment settings.
AC: [services.resources] Repeated costly requests stay bounded; valid use works.
V: [services.resources] Test limits locally and inspect actual production config when authorized.

Sources:
- https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Denial_of_Service_Cheat_Sheet.html
