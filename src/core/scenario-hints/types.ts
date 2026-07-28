export type Scenario = {
  id: string;
  title: string;
  outcome: string;
  partOutcome: string;
  steps: string[];
  evidenceRequired: string[];
  doneWhen: string[];
};
