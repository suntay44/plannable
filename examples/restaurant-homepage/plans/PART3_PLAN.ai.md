@PlannablePlan v0.1

ID=PART-003
PH=UI_UX_PHASE
SCN=SCN-003
OUT=Mobile food browsing works
DEP=[PART-002]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- Mobile visitor browses food visually

CTX:
- product: Restaurant Homepage — presenting a restaurant brand and fast ordering actions
- phase: UI/UX Phase (part 3/3)
- prior: PART-001 delivered "Homepage hero works"; PART-002 delivered "Quick order path works"
- next: COMPLETE — run plannable verify

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
1 Add a mobile-friendly visual food section.
2 Show food names, short descriptions, and ordering cues.
3 Verify the section remains scannable on narrow screens.

AC:
- Food imagery is visible and relevant.
- Names and descriptions are readable on mobile.
- Ordering cues remain easy to reach.

V:
- npm run typecheck?
- npm test?
- npm run build?

DONE:
- update MASTER_PLAN.md Part 3=[x]
- append PLAN_EVIDENCE.md#PART-003 with files+checks+notes
- run plannable repair to regenerate PLAN_STATE.md, or update current_part=COMPLETE

S:
- if project structure is unclear, inspect before editing
- if acceptance requires product scope outside this part, record a TODO
