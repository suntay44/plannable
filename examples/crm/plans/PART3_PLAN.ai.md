@PlannablePlan v0.1

ID=PART-003
PH=CORE_CRM_FOUNDATION
SCN=SCN-003
OUT=Follow-up tasks work
DEP=[PART-002]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- User creates a follow-up task

CTX:
- product: CRM — managing contacts, companies, deals, tasks, and follow-ups
- phase: Core CRM Foundation (part 3/3)
- prior: PART-001 delivered "Contact management works"; PART-002 delivered "Deal pipeline works"
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
1 Create a task model with title, due date, owner, and completion status.
2 Build task creation from the CRM workflow.
3 Show pending and completed tasks separately or with clear status.
4 Allow users to mark a task complete.

AC:
- A user can create a follow-up task.
- A task can be marked complete.
- Pending tasks remain easy to find.

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
