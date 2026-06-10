@PlannablePlan v0.1

ID=PART-001
PH=CORE_CRM_FOUNDATION
SCN=SCN-001
OUT=Contact management works
DEP=[]

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- User adds a new contact

CTX:
- product: CRM — managing contacts, companies, deals, tasks, and follow-ups
- phase: Core CRM Foundation (part 1/3)
- prior: none — this is the first part
- next: PART-002 covers "Deal pipeline works"

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
1 Create a contact data model with name, email, phone, company, and notes.
2 Build the create-contact workflow.
3 Show saved contacts in a scannable list.
4 Handle empty, loading, and validation states.

AC:
- A user can save a contact with all required fields.
- The saved contact appears after creation.
- Invalid contact input is blocked or clearly explained.

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
