export const FEATURES = [
  "dependencies",
  "privateData",
  "accounts",
  "browserSession",
  "externalInput",
  "files",
  "outboundUrls",
  "storedData",
  "integrations",
  "incomingEvents",
  "publicService",
  "ui"
] as const;
export type Feature = (typeof FEATURES)[number];
export type Fact = { value: boolean | "unknown"; source: "observed" | "owner" | "inferred"; reason: string };
export type Facts = Partial<Record<Feature, Fact>>;
export type Rule = {
  id: string;
  when: "always" | Feature;
  constraint: string;
  task: string;
  acceptance: string;
  verification: string;
};
export type GuidanceModule = {
  id: string;
  revision: number;
  reviewed: string;
  sources: string[];
  rules: Rule[];
};
export type SelectedRule = Rule & { module: string; revision: number; reason: string };
export type Selection = { rules: SelectedRule[]; decisions: string[] };
