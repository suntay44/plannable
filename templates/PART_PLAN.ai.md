@PlannablePlan v0.1

ID={{partId}}
PH={{phase}}
SCN={{scenarioId}}
OUT={{outcome}}
DEP={{dependsOn}}

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion_updates; S=stop

G:
- {{goal}}

CTX:
- product: {{productName}} — {{productGoal}}
- phase: {{phaseName}} (part {{partNumber}}/{{partCount}})
- prior: {{priorContext}}
- next: {{nextContext}}

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
{{steps}}

AC:
{{acceptanceCriteria}}

V:
- npm run typecheck?
- npm test?
- npm run build?

DONE:
- update MASTER_PLAN.md Part {{partNumber}}=[x]
- append PLAN_EVIDENCE.md#{{partId}} with files+checks+notes
- run plannable repair to regenerate PLAN_STATE.md, or update current_part={{nextPart}}

S:
- if project structure is unclear, inspect before editing
- if acceptance requires product scope outside this part, record a TODO
