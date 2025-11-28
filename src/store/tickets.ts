import { Ticket } from "@/types";

export const mockTickets: Ticket[] = [
  {
    id: "PROJ-101",
    title: "Implement authentication flow",
    description: "Set up full auth including JWT, refresh rotation, and protected routes.",
    type: "feature",
    priority: "high",
    status: "in-progress",
    createdAt: "2025-10-01T08:15:00.000Z",
    updatedAt: "2025-10-12T11:20:00.000Z",
    dueDate: "2025-11-05T17:00:00.000Z",
    relatedTicketIds: ["PROJ-115"],
    assignee: {
      name: "John Doe",
      avatar: "https://i.pravatar.cc/100?img=5"
    },
    subtasks: [
      { id: "1", title: "Create login page", done: true },
      { id: "2", title: "Setup JWT", done: false },
      { id: "3", title: "Add refresh token rotation", done: false }
    ],
    comments: [
      {
        id: "c1",
        author: {
          name: "John Doe",
          avatar: "https://i.pravatar.cc/100?img=5"
        },
        message: "Blocked on refresh token API design.",
        createdAt: "2025-10-10T09:05:00.000Z"
      }
    ]
  },
  {
    id: "PROJ-102",
    title: "Fix mobile layout spacing",
    description: "Correct spacing issues on mobile header, footer, and action buttons.",
    type: "bug",
    priority: "medium",
    status: "done",
    createdAt: "2025-09-18T10:30:00.000Z",
    updatedAt: "2025-10-02T14:00:00.000Z",
    relatedTicketIds: ["PROJ-120", "PROJ-104"],
    assignee: {
      name: "Sarah Connor",
      avatar: "https://i.pravatar.cc/100?img=22"
    },
    subtasks: [
      { id: "1", title: "Fix header padding", done: true },
      { id: "2", title: "Fix footer alignment", done: true },
      { id: "3", title: "Fix button tap area", done: true }
    ],
    comments: [
      {
        id: "c2",
        author: {
          name: "Sarah Connor",
          avatar: "https://i.pravatar.cc/100?img=22"
        },
        message: "QA verified across iOS and Android.",
        createdAt: "2025-10-01T16:45:00.000Z"
      }
    ]
  },
  {
    id: "PROJ-103",
    title: "Add dark mode toggle",
    description: "Implement theme toggle and persist user preference.",
    type: "feature",
    priority: "low",
    status: "todo",
    createdAt: "2025-10-05T12:00:00.000Z",
    dueDate: "2025-12-01T09:00:00.000Z",
    assignee: {
      name: "Michael Smith",
      avatar: "https://i.pravatar.cc/100?img=12"
    },
    subtasks: [
      { id: "1", title: "Design switch component", done: false },
      { id: "2", title: "Store theme in localStorage", done: false }
    ],
    comments: []
  },
  {
    id: "PROJ-104",
    title: "Create onboarding modal",
    description: "Design and ship onboarding experience for new users.",
    type: "task",
    priority: "medium",
    status: "in-progress",
    createdAt: "2025-09-27T07:45:00.000Z",
    updatedAt: "2025-10-10T10:15:00.000Z",
    relatedTicketIds: ["PROJ-102"],
    assignee: {
      name: "Alice Night",
      avatar: "https://i.pravatar.cc/100?img=64"
    },
    subtasks: [],
    comments: [
      {
        id: "c3",
        author: {
          name: "Alice Night",
          avatar: "https://i.pravatar.cc/100?img=64"
        },
        message: "Waiting on copy review.",
        createdAt: "2025-10-08T13:22:00.000Z"
      }
    ]
  }
];