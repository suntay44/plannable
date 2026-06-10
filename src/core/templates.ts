export type Scenario = {
  id: string;
  title: string;
  outcome: string;
  partOutcome: string;
  steps: string[];
  evidenceRequired: string[];
  doneWhen: string[];
};

export type PlanModel = {
  productName: string;
  productSlug: string;
  productGoal: string;
  phaseName: string;
  scenarios: Scenario[];
};

const crmScenarioHints: Scenario[] = [
  {
    id: "SCN-001",
    title: "User adds a new contact",
    outcome: "Contact is saved with name, email, phone, company, and notes.",
    partOutcome: "Contact management works",
    steps: [
      "Create a contact data model with name, email, phone, company, and notes.",
      "Build the create-contact workflow.",
      "Show saved contacts in a scannable list.",
      "Handle empty, loading, and validation states."
    ],
    evidenceRequired: [
      "Changed files for the contact model and UI/API workflow.",
      "Passing test, build, or manual QA command output.",
      "A short note proving a contact can be created and viewed."
    ],
    doneWhen: [
      "A user can save a contact with all required fields.",
      "The saved contact appears after creation.",
      "Invalid contact input is blocked or clearly explained."
    ]
  },
  {
    id: "SCN-002",
    title: "User tracks a sales deal",
    outcome: "Deal can move through pipeline stages.",
    partOutcome: "Deal pipeline works",
    steps: [
      "Create a deal model with title, company/contact, value, and stage.",
      "Add pipeline stages for new, qualified, proposal, won, and lost deals.",
      "Build a way to move deals between stages.",
      "Persist and display the current stage for each deal."
    ],
    evidenceRequired: [
      "Changed files for deal storage and pipeline behavior.",
      "Verification showing a deal moving between at least two stages.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "A user can create a deal.",
      "A deal can move through pipeline stages.",
      "The current stage remains visible after the update."
    ]
  },
  {
    id: "SCN-003",
    title: "User creates a follow-up task",
    outcome: "User can create, complete, and view pending tasks.",
    partOutcome: "Follow-up tasks work",
    steps: [
      "Create a task model with title, due date, owner, and completion status.",
      "Build task creation from the CRM workflow.",
      "Show pending and completed tasks separately or with clear status.",
      "Allow users to mark a task complete."
    ],
    evidenceRequired: [
      "Changed files for task creation and completion.",
      "Verification showing pending and completed task states.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "A user can create a follow-up task.",
      "A task can be marked complete.",
      "Pending tasks remain easy to find."
    ]
  }
];

const todoScenarioHints: Scenario[] = [
  {
    id: "SCN-001",
    title: "User adds a task",
    outcome: "Task is saved with a clear title and default pending status.",
    partOutcome: "Task creation works",
    steps: [
      "Create a task model with title, notes, due date, and completion status.",
      "Build the add-task workflow.",
      "Show the new task immediately after creation.",
      "Handle empty and invalid task titles."
    ],
    evidenceRequired: [
      "Changed files for task data and creation flow.",
      "Verification showing a task being created.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "A user can add a task.",
      "The task appears in the pending list.",
      "Blank task titles are rejected or explained."
    ]
  },
  {
    id: "SCN-002",
    title: "User completes a task",
    outcome: "Completed task is marked done and no longer mixed with pending work.",
    partOutcome: "Task completion works",
    steps: [
      "Add a completion action to each pending task.",
      "Persist the completed state.",
      "Display completed tasks distinctly from pending tasks."
    ],
    evidenceRequired: [
      "Changed files for task completion behavior.",
      "Verification showing a pending task becoming completed.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "A user can complete a task.",
      "Completed tasks are visibly distinct.",
      "Pending task counts or views update correctly."
    ]
  },
  {
    id: "SCN-003",
    title: "User reviews upcoming tasks",
    outcome: "Pending tasks can be sorted or filtered by due date.",
    partOutcome: "Task review works",
    steps: [
      "Add due-date display to task views.",
      "Sort or filter pending tasks by due date.",
      "Make overdue tasks easy to identify."
    ],
    evidenceRequired: [
      "Changed files for due-date review behavior.",
      "Verification showing ordered or filtered pending tasks.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "Pending tasks show due dates.",
      "Upcoming or overdue work is easy to find.",
      "Tasks without due dates remain understandable."
    ]
  }
];

const restaurantHomepageScenarioHints: Scenario[] = [
  {
    id: "SCN-001",
    title: "First-time visitor understands the brand",
    outcome: "Homepage clearly communicates cuisine, location, hours, and atmosphere.",
    partOutcome: "Homepage hero works",
    steps: [
      "Create a first viewport with restaurant name, cuisine, location, and open hours.",
      "Use a relevant food or dining visual.",
      "Add primary actions for menu and reservation."
    ],
    evidenceRequired: [
      "Changed files for homepage structure and styling.",
      "Screenshot or manual QA note for desktop and mobile first viewport.",
      "Any test or build command output."
    ],
    doneWhen: [
      "The restaurant identity is clear in the first viewport.",
      "Menu and reservation actions are visible.",
      "The layout works on mobile and desktop."
    ]
  },
  {
    id: "SCN-002",
    title: "Returning user can order quickly",
    outcome: "Returning users can quickly reach the order path.",
    partOutcome: "Quick order path works",
    steps: [
      "Add a clear order-now action for returning guests.",
      "Surface loyalty, gift card, and referral entry points near ordering.",
      "Keep ordering actions visible and readable on mobile."
    ],
    evidenceRequired: [
      "Changed files for ordering and returning-user actions.",
      "Screenshot or manual QA note showing order, loyalty, gift card, and referral actions.",
      "Any test or build command output."
    ],
    doneWhen: [
      "Returning users can find the order-now action quickly.",
      "Loyalty, gift card, and referral actions are visible.",
      "The section remains readable on mobile."
    ]
  },
  {
    id: "SCN-003",
    title: "Mobile visitor browses food visually",
    outcome: "Mobile visitors can inspect food imagery, names, and key ordering details without layout friction.",
    partOutcome: "Mobile food browsing works",
    steps: [
      "Add a mobile-friendly visual food section.",
      "Show food names, short descriptions, and ordering cues.",
      "Verify the section remains scannable on narrow screens."
    ],
    evidenceRequired: [
      "Changed files for mobile food browsing content and layout.",
      "Screenshot or manual QA note for a narrow mobile viewport.",
      "Any test or build command output."
    ],
    doneWhen: [
      "Food imagery is visible and relevant.",
      "Names and descriptions are readable on mobile.",
      "Ordering cues remain easy to reach."
    ]
  }
];

const billingDashboardScenarioHints: Scenario[] = [
  {
    id: "SCN-001",
    title: "Operator views billing health",
    outcome: "Revenue, subscriptions, failed payments, and plan mix are visible at a glance.",
    partOutcome: "Billing overview works",
    steps: [
      "Define billing summary metrics for revenue, active subscriptions, failed payments, and churn risk.",
      "Build a dashboard overview with loading, empty, and error states.",
      "Link summary metrics to deeper billing records."
    ],
    evidenceRequired: [
      "Changed files for billing data, dashboard UI, or API behavior.",
      "Verification showing the billing overview with representative data.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "Billing health is visible in one scannable view.",
      "Failed or risky payment states are easy to notice.",
      "The overview handles empty and loading states."
    ]
  },
  {
    id: "SCN-002",
    title: "Operator manages a customer subscription",
    outcome: "A subscription can be inspected and updated without losing billing context.",
    partOutcome: "Subscription management works",
    steps: [
      "Create a subscription detail view or workflow.",
      "Show plan, status, renewal date, billing email, and recent invoices.",
      "Add a safe update action for plan or status changes."
    ],
    evidenceRequired: [
      "Changed files for subscription detail or update behavior.",
      "Verification showing before and after subscription state.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "A subscription can be inspected.",
      "Important billing fields are visible.",
      "Allowed changes persist and are reflected in the UI."
    ]
  },
  {
    id: "SCN-003",
    title: "Operator reviews billing exceptions",
    outcome: "Failed payments, overdue invoices, and cancellation risks can be found and acted on.",
    partOutcome: "Billing exceptions work",
    steps: [
      "Define exception states for failed, overdue, canceled, or at-risk accounts.",
      "Add filters or lists for billing exceptions.",
      "Make the next action clear for each exception."
    ],
    evidenceRequired: [
      "Changed files for exception state display and filtering.",
      "Verification showing at least two exception states.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "Billing exceptions are visible.",
      "Operators can distinguish failed, overdue, and at-risk states.",
      "Each exception has a clear next action."
    ]
  }
];

const mobileAppScenarioHints: Scenario[] = [
  {
    id: "SCN-001",
    title: "User completes onboarding",
    outcome: "A new user can understand the app, grant required permissions, and reach the main experience.",
    partOutcome: "Onboarding works",
    steps: [
      "Define the minimum onboarding steps and local state needed.",
      "Build the onboarding flow with skip, back, and completion behavior.",
      "Handle required permissions or preferences clearly."
    ],
    evidenceRequired: [
      "Changed files for onboarding screens, state, or navigation.",
      "Screenshot or manual QA note for onboarding completion.",
      "Any test, build, or device/simulator notes."
    ],
    doneWhen: [
      "A new user can complete onboarding.",
      "Required choices or permissions are clear.",
      "Returning users bypass completed onboarding."
    ]
  },
  {
    id: "SCN-002",
    title: "User uses the main mobile workflow",
    outcome: "The primary mobile action works on a small screen with clear feedback.",
    partOutcome: "Main mobile workflow works",
    steps: [
      "Identify the primary mobile action and its saved state.",
      "Build the main screen interaction with touch-friendly controls.",
      "Show success, empty, loading, and error states."
    ],
    evidenceRequired: [
      "Changed files for the main mobile workflow.",
      "Manual QA note or screenshot for a small-screen viewport/device.",
      "Any test, build, or simulator command output."
    ],
    doneWhen: [
      "The primary workflow can be completed on mobile.",
      "Touch targets and layout are usable.",
      "Feedback is visible after the action."
    ]
  },
  {
    id: "SCN-003",
    title: "User returns to saved state",
    outcome: "Important app state survives navigation, refresh, or app restart where appropriate.",
    partOutcome: "Mobile persistence works",
    steps: [
      "Identify state that should persist locally or remotely.",
      "Restore that state when the user returns.",
      "Handle missing, stale, or invalid persisted data."
    ],
    evidenceRequired: [
      "Changed files for state persistence or hydration.",
      "Verification showing state before and after return/restart.",
      "Any test, build, or manual QA notes."
    ],
    doneWhen: [
      "Expected state is restored.",
      "Missing or invalid state does not break the app.",
      "The user understands the restored state."
    ]
  }
];

const apiScenarioHints: Scenario[] = [
  {
    id: "SCN-001",
    title: "Client creates a resource",
    outcome: "An API client can create a valid resource and receive a predictable response.",
    partOutcome: "Resource creation API works",
    steps: [
      "Define the resource schema, validation rules, and response shape.",
      "Implement the create endpoint or handler.",
      "Return clear success and validation error responses."
    ],
    evidenceRequired: [
      "Changed files for API schema, handler, or validation.",
      "Request/response verification for success and invalid input.",
      "Any test, build, or manual API notes."
    ],
    doneWhen: [
      "Valid input creates a resource.",
      "Invalid input returns a clear error.",
      "The response shape is predictable."
    ]
  },
  {
    id: "SCN-002",
    title: "Client reads and filters resources",
    outcome: "An API client can list resources and narrow results with supported filters.",
    partOutcome: "Resource query API works",
    steps: [
      "Implement list/read behavior for the resource.",
      "Add supported filters, pagination, or sorting.",
      "Document response shape and empty results."
    ],
    evidenceRequired: [
      "Changed files for read/list API behavior.",
      "Verification showing filtered and empty responses.",
      "Any test, build, or manual API notes."
    ],
    doneWhen: [
      "Resources can be listed or read.",
      "Supported filters behave predictably.",
      "Empty responses are handled clearly."
    ]
  },
  {
    id: "SCN-003",
    title: "Client handles API errors",
    outcome: "Auth, validation, missing resource, and server errors return consistent status and body shapes.",
    partOutcome: "API error handling works",
    steps: [
      "Define standard error response fields.",
      "Apply consistent error handling to key endpoints.",
      "Verify common failure cases."
    ],
    evidenceRequired: [
      "Changed files for API error handling.",
      "Verification showing at least two error responses.",
      "Any test, build, or manual API notes."
    ],
    doneWhen: [
      "Common errors have consistent shapes.",
      "Status codes match failure type.",
      "Clients can safely display or handle errors."
    ]
  }
];

function titleCase(value: string): string {
  return value
    .replace(/[-_]+/g, " ")
    .trim()
    .split(/\s+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "product";
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
  return normalized.includes("mobile") || normalized.includes("ios") || normalized.includes("android") || normalized.includes("react native");
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
