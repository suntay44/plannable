@PlannablePlan v0.1

ID=PART-002
PH=CORE_TODO_APP_FOUNDATION
SCN=SCN-002
OUT=Task completion works
DEP=[PART-001]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- User completes a task

CTX:
- product: TODO App — creating, completing, and reviewing tasks
- phase: Core TODO App Foundation (part 2/3)
- prior: PART-001 delivered "Task creation works"
- next: PART-003 covers "Task review works"

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
1 Add a completion action to each pending task.
2 Persist the completed state.
3 Display completed tasks distinctly from pending tasks.

AC:
- A user can complete a task.
- Completed tasks are visibly distinct.
- Pending task counts or views update correctly.

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
