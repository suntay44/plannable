@PlannablePlan v0.1

ID=PART-002
PH=CORE_CRM_FOUNDATION
SCN=SCN-002
OUT=Deal pipeline works
DEP=[PART-001]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- User tracks a sales deal

CTX:
- product: CRM — managing contacts, companies, deals, tasks, and follow-ups
- phase: Core CRM Foundation (part 2/3)
- prior: PART-001 delivered "Contact management works"
- next: PART-003 covers "Follow-up tasks work"

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
1 Create a deal model with title, company/contact, value, and stage.
2 Add pipeline stages for new, qualified, proposal, won, and lost deals.
3 Build a way to move deals between stages.
4 Persist and display the current stage for each deal.

AC:
- A user can create a deal.
- A deal can move through pipeline stages.
- The current stage remains visible after the update.

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
