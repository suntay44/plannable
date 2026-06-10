@PlannablePlan v0.1

ID=PART-002
PH=UI_UX_PHASE
SCN=SCN-002
OUT=Quick order path works
DEP=[PART-001]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- Returning user can order quickly

CTX:
- product: Restaurant Homepage — presenting a restaurant brand and fast ordering actions
- phase: UI/UX Phase (part 2/3)
- prior: PART-001 delivered "Homepage hero works"
- next: PART-003 covers "Mobile food browsing works"

C:
- preserve-existing-work
- avoid-unrelated-edits
- ask-before-new-deps

F:
+ src/*
+ app/*
+ components/*
+ tests/*
? docs/*

T:
1 Add a clear order-now action for returning guests.
2 Surface loyalty, gift card, and referral entry points near ordering.
3 Keep ordering actions visible and readable on mobile.

AC:
- Returning users can find the order-now action quickly.
- Loyalty, gift card, and referral actions are visible.
- The section remains readable on mobile.

V:
- npm run typecheck?
- npm test?
- npm run build?

DONE:
- update MASTER_PLAN.md Part 2=[x]
- append PLAN_EVIDENCE.md#PART-002 with files+checks+notes
- run plannable repair to regenerate PLAN_STATE.md, or update current_part=PART-003

S:
- if project structure is unclear, inspect before editing
- if acceptance requires product scope outside this part, record a TODO
