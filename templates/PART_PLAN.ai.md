@PlannablePlan v0.1

ID={{partId}}
PH={{phase}}
SCN={{scenarioId}}
OUT={{outcome}}
DEP={{dependsOn}}

DICT:
G=goal; CTX=context; C=constraint; F=file; T=task; AC=acceptance; V=verify; DONE=completion; S=stop

G:
- {{goal}}

CTX:
- product: {{productName}} — {{productGoal}}
- phase: {{phaseName}} (part {{partNumber}}/{{partCount}})
- prior: {{priorContext}}
- next: {{nextContext}}{{requestContext}}{{guidanceContext}}

C:
- preserve-existing-work
- avoid-unrelated-edits
- ask-before-new-deps{{guidanceConstraints}}

F:
{{files}}

T:
{{steps}}{{guidanceTasks}}

AC:
{{acceptanceCriteria}}{{guidanceAcceptance}}

V:
{{verification}}{{guidanceVerification}}

DONE:
- append PLAN_EVIDENCE.md#{{partId}}: summary+files+checks+notes
- run plannable complete {{partId}}

S:
- if project structure is unclear, inspect before editing
- if acceptance requires product scope outside this part, record a TODO{{guidanceStops}}
