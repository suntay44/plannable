@PlannablePlan v0.1

ID=PART-001
PH=CORE_TODO_APP_FOUNDATION
SCN=SCN-001
OUT=Task creation works
DEP=[]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- User adds a task

CTX:
- product: TODO App — creating, completing, and reviewing tasks
- phase: Core TODO App Foundation (part 1/3)
- prior: none — this is the first part
- next: PART-002 covers "Task completion works"

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
1 Create a task model with title, notes, due date, and completion status.
2 Build the add-task workflow.
3 Show the new task immediately after creation.
4 Handle empty and invalid task titles.

AC:
- A user can add a task.
- The task appears in the pending list.
- Blank task titles are rejected or explained.

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
