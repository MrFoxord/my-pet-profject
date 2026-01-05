import { Board } from "@/types";
import { mockTickets } from "./tickets";

const createColumnsFromTickets = (tickets: typeof mockTickets) => {
  return [
    {
      id: "todo",
      title: "To Do",
      ticketIds: tickets.filter((t) => t.status === "todo").map((t) => t.id),
    },
    {
      id: "in-progress",
      title: "In Progress",
      ticketIds: tickets
        .filter((t) => t.status === "in-progress")
        .map((t) => t.id),
    },
    {
      id: "done",
      title: "Done",
      ticketIds: tickets.filter((t) => t.status === "done").map((t) => t.id),
    },
  ];
};

export const mockBoards: Board[] = [
  {
    id: "1",
    title: "Marketing Board",
    description: "Board for marketing tasks",
    logoUrl: "/logos/marketing.png",
    themeColor: "#f3f4f6",
    tickets: mockTickets,
    columns: createColumnsFromTickets(mockTickets),
  },
  {
    id: "2",
    title: "Development Board",
    description: "Board for dev tasks",
    logoUrl: "/logos/dev.png",
    themeColor: "#e0f7fa",
    tickets: mockTickets,
    columns: createColumnsFromTickets(mockTickets),
  },
];