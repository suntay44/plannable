@PlannablePlan v0.1

ID=PART-001
PH=UI_UX_PHASE
SCN=SCN-001
OUT=Homepage hero works
DEP=[]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- First-time visitor understands the brand

CTX:
- product: Restaurant Homepage — presenting a restaurant brand and fast ordering actions
- phase: UI/UX Phase (part 1/3)
- prior: none — this is the first part
- next: PART-002 covers "Quick order path works"

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
1 Create a first viewport with restaurant name, cuisine, location, and open hours.
2 Use a relevant food or dining visual.
3 Add primary actions for menu and reservation.

AC:
- The restaurant identity is clear in the first viewport.
- Menu and reservation actions are visible.
- The layout works on mobile and desktop.

V:
- npm run typecheck?
- npm test?
- npm run build?

DONE:
- update MASTER_PLAN.md Part 1=[x]
- append PLAN_EVIDENCE.md#PART-001 with files+checks+notes
- run plannable repair to regenerate PLAN_STATE.md, or update current_part=PART-002

S:
- if project structure is unclear, inspect before editing
- if acceptance requires product scope outside this part, record a TODO
