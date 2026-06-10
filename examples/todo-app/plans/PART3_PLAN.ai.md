@PlannablePlan v0.1

ID=PART-003
PH=CORE_TODO_APP_FOUNDATION
SCN=SCN-003
OUT=Task review works
DEP=[PART-002]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- User reviews upcoming tasks

CTX:
- product: TODO App — creating, completing, and reviewing tasks
- phase: Core TODO App Foundation (part 3/3)
- prior: PART-001 delivered "Task creation works"; PART-002 delivered "Task completion works"
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
1 Add due-date display to task views.
2 Sort or filter pending tasks by due date.
3 Make overdue tasks easy to identify.

AC:
- Pending tasks show due dates.
- Upcoming or overdue work is easy to find.
- Tasks without due dates remain understandable.

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
