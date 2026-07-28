import {
  apiScenarioHints,
  billingDashboardScenarioHints,
  crmScenarioHints,
  mobileAppScenarioHints,
  restaurantHomepageScenarioHints,
  todoScenarioHints,
  type Scenario
} from "./scenario-hints/index.js";

export type { Scenario } from "./scenario-hints/index.js";

export type PlanModel = {
  productName: string;
  productSlug: string;
  productGoal: string;
  phaseName: string;
  scenarios: Scenario[];
};

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function slugify(value: string): string {
  return (
    value
      .toLowerCase()
      .replace(/['"]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "product"
  );
}

function generalSoftwareScenarioHints(productName: string): Scenario[] {
  const noun = productName.toLowerCase();
  const mainThing = inferPrimaryThing(productName);
  const mainThingArticle = articleForThing(mainThing);
  const mainThingPlural = pluralizeThing(mainThing);
  return [
    {
      id: "SCN-001",
      title: `User creates ${mainThingArticle}`,
      outcome: `User can create ${mainThingArticle} for ${noun} and see it immediately.`,
      partOutcome: `${titleCase(mainThing)} creation works`,
      steps: [
        `Identify the fields, state, or content needed for ${mainThingArticle}.`,
        `Build the create-${slugify(mainThing)} workflow.`,
        `Show the saved ${mainThing} in the main experience.`,
        "Handle empty, loading, validation, and error states."
      ],
      evidenceRequired: [
        `Changed files for ${mainThing} data, UI, or API behavior.`,
        `Verification showing a ${mainThing} from create action to visible result.`,
        "Any test, build, or manual QA notes."
      ],
      doneWhen: [
        `A user can create ${mainThingArticle}.`,
        `The created ${mainThing} is visible after completion.`,
        "Basic empty and invalid states are handled."
      ]
    },
    {
      id: "SCN-002",
      title: `User manages an existing ${mainThing}`,
      outcome: `User can update or act on an existing ${mainThing} and see the changed state.`,
      partOutcome: `${titleCase(mainThing)} management works`,
      steps: [
        `Add an edit, update, or primary action for an existing ${mainThing}.`,
        "Persist changed values.",
        "Show updated state without ambiguity.",
        "Protect against accidental or invalid changes."
      ],
      evidenceRequired: [
        `Changed files for ${mainThing} management behavior.`,
        "Verification showing before and after states.",
        "Any test, build, or manual QA notes."
      ],
      doneWhen: [
        `A user can manage an existing ${mainThing}.`,
        "The changed values persist.",
        "The UI or output reflects the update."
      ]
    },
    {
      id: "SCN-003",
      title: `User reviews ${mainThing} status`,
      outcome: `User can understand which ${mainThingPlural} are active, complete, blocked, or need attention.`,
      partOutcome: `${titleCase(mainThing)} review works`,
      steps: [
        `Define the most important ${mainThing} status states.`,
        `Display status, priority, or progress for ${mainThingPlural}.`,
        "Make filters, sorting, or next actions clear.",
        "Handle empty and completed states."
      ],
      evidenceRequired: [
        `Changed files for ${mainThing} review/status display.`,
        "Verification showing at least two status states.",
        "Any test, build, or manual QA notes."
      ],
      doneWhen: [
        "Status is visible to the user.",
        "Done and pending states are distinct.",
        "The next useful action is clear."
      ]
    }
  ];
}

function inferPrimaryThing(productName: string): string {
  const normalized = productName.toLowerCase();
  if (normalized.includes("inventory")) return "inventory item";
  if (normalized.includes("booking") || normalized.includes("reservation")) return "booking";
  if (normalized.includes("dashboard")) return "dashboard metric";
  if (normalized.includes("marketplace")) return "listing";
  if (normalized.includes("chat") || normalized.includes("message")) return "message";
  if (normalized.includes("course") || normalized.includes("learning")) return "lesson";
  if (normalized.includes("expense") || normalized.includes("invoice")) return "record";
  if (normalized.includes("calendar") || normalized.includes("schedule")) return "event";
  if (normalized.includes("api")) return "resource";
  return "item";
}

function articleForThing(value: string): string {
  return /^[aeiou]/i.test(value) ? `an ${value}` : `a ${value}`;
}

function pluralizeThing(value: string): string {
  if (value.endsWith("y")) return `${value.slice(0, -1)}ies`;
  if (value.endsWith("s")) return value;
  return `${value}s`;
}

export function buildPlanModel(rawName: string): PlanModel {
  const productName = titleCase(rawName || "Product");
  const normalized = productName.toLowerCase();

  return {
    productName,
    productSlug: slugify(productName),
    productGoal: productGoalFor(productName, normalized),
    phaseName: phaseNameFor(productName, normalized),
    scenarios: scenarioHintsFor(productName, normalized)
  };
}

function scenarioHintsFor(productName: string, normalized: string): Scenario[] {
  if (normalized.includes("crm")) return crmScenarioHints;
  if (normalized.includes("todo") || normalized.includes("to do")) return todoScenarioHints;
  if (normalized.includes("restaurant")) return restaurantHomepageScenarioHints;
  if (hasBillingHint(normalized)) return billingDashboardScenarioHints;
  if (hasMobileHint(normalized)) return mobileAppScenarioHints;
  if (hasApiHint(normalized)) return apiScenarioHints;
  return generalSoftwareScenarioHints(productName);
}

function productGoalFor(productName: string, normalized: string): string {
  if (normalized.includes("crm")) return "managing contacts, companies, deals, tasks, and follow-ups";
  if (normalized.includes("restaurant")) return "presenting a restaurant brand and fast ordering actions";
  if (normalized.includes("todo") || normalized.includes("to do")) return "creating, completing, and reviewing tasks";
  if (hasBillingHint(normalized)) return "monitoring billing health, subscriptions, and revenue exceptions";
  if (hasMobileHint(normalized)) return "delivering a usable mobile workflow with onboarding and persisted state";
  if (hasApiHint(normalized)) return "creating reliable API resources, queries, and error handling";
  return `supporting the main ${productName} user workflows`;
}

function phaseNameFor(productName: string, normalized: string): string {
  if (normalized.includes("crm")) return "Core CRM Foundation";
  if (normalized.includes("restaurant")) return "UI/UX Phase";
  if (hasBillingHint(normalized)) return "Billing Operations Foundation";
  if (hasMobileHint(normalized)) return "Mobile Experience Foundation";
  if (hasApiHint(normalized)) return "API Foundation";
  return `Core ${productName} Foundation`;
}

function hasBillingHint(normalized: string): boolean {
  return normalized.includes("billing") || normalized.includes("subscription") || normalized.includes("saas dashboard");
}

function hasMobileHint(normalized: string): boolean {
  return (
    normalized.includes("mobile") ||
    normalized.includes("ios") ||
    normalized.includes("android") ||
    normalized.includes("react native")
  );
}

function hasApiHint(normalized: string): boolean {
  return normalized.includes("api") || normalized.includes("backend");
}

export function renderTemplate(template: string, values: Record<string, string>): string {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key: string) => values[key] ?? "");
}

const GENERIC_PLAN_MARKERS = [
  "User creates an item",
  "User manages an existing item",
  "User reviews item status",
  "Item creation works",
  "Item management works",
  "Item review works"
];

/**
 * Detects plans still using the generic fallback wording from
 * generalSoftwareScenarioHints. These are first drafts: an agent (or human)
 * should replace them with product-specific scenarios before implementing.
 */
export function findGenericPlanMarkers(content: string): string[] {
  return GENERIC_PLAN_MARKERS.filter((marker) => content.includes(marker));
}
