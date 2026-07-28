import type { Scenario } from "./types.js";

export const restaurantHomepageScenarioHints: Scenario[] = [
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

export const billingDashboardScenarioHints: Scenario[] = [
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
