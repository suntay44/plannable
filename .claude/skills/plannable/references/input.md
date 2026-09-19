# input guidance (revision 1)

Reviewed: 2026-09-17. Sources inform original guidance; no certification is implied.

## input.boundary
Applies: only when externalInput is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [input.boundary] Validate at trusted boundaries; use safe query/command/output APIs.
T: [input.boundary] Constrain input shape/size; keep untrusted data out of executable syntax.
AC: [input.boundary] Malformed/injection input is rejected or stays data; valid input works.
V: [input.boundary] Test malformed and injection payloads plus legitimate input.

## input.files
Applies: only when files is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [input.files] Constrain paths, uploads and sizes; preserve unrelated files.
T: [input.files] Use contained paths and permitted file types/sizes for this feature.
AC: [input.files] Traversal and oversized files fail without unrelated changes; allowed files work.
V: [input.files] Test traversal, limits and a valid operation in temporary directories.

## input.urls
Applies: only when outboundUrls is confirmed. Otherwise inspect uncertain scope; do not introduce the feature.
C: [input.urls] Constrain destinations for server-side requests.
T: [input.urls] Apply destination rules and redirect checks for the actual service.
AC: [input.urls] Unapproved destinations/redirects fail; approved requests work.
V: [input.urls] Test destination and redirect restrictions without contacting private networks.

Sources:
- https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/File_Upload_Cheat_Sheet.html
- https://cheatsheetseries.owasp.org/cheatsheets/Server_Side_Request_Forgery_Prevention_Cheat_Sheet.html
