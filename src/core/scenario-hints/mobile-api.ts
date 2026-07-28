import type { Scenario } from "./types.js";

export const mobileAppScenarioHints: Scenario[] = [
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

export const apiScenarioHints: Scenario[] = [
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
