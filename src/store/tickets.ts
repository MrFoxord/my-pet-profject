import { Ticket } from "@/types";

export const mockTickets: Ticket[] = [
  {
    id: "PROJ-101",
    title: "Implement authentication flow",
    type: "feature",
    priority: "high",
    assignee: {
      id: 1,
      name: "John Doe",
      avatar: "https://i.pravatar.cc/100?img=5"
    },
    subtasks: [
      { id: "1", title: "Create login page", done: true },
      { id: "2", title: "Setup JWT", done: false },
      { id: "3", title: "Add refresh token rotation", done: false }
    ]
  },
  {
    id: "PROJ-102",
    title: "Fix mobile layout spacing",
    type: "bug",
    priority: "medium",
    assignee: {
      id: 2,
      name: "Sarah Connor",
      avatar: "https://i.pravatar.cc/100?img=22"
    },
    subtasks: [
      { id: "1", title: "Fix header padding", done: true },
      { id: "2", title: "Fix footer alignment", done: true },
      { id: "3", title: "Fix button tap area", done: false }
    ]
  },
  {
    id: "PROJ-103",
    title: "Add dark mode toggle",
    type: "feature",
    priority: "low",
    assignee: {
      id: 3,
      name: "Michael Smith",
      avatar: "https://i.pravatar.cc/100?img=12"
    },
    subtasks: [
      { id: "1", title: "Design switch component", done: false },
      { id: "2", title: "Store theme in localStorage", done: false }
    ]
  },
  {
    id: "PROJ-104",
    title: "Create onboarding modal",
    type: "task",
    priority: "medium",
    assignee: {
      id: 4,
      name: "Alice Night",
      avatar: "https://i.pravatar.cc/100?img=64"
    },
    subtasks: []
  }
];