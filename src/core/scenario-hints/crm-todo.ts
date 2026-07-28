import type { Scenario } from "./types.js";

export const crmScenarioHints: Scenario[] = [
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

export const todoScenarioHints: Scenario[] = [
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
