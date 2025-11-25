import { Board } from "@/types";
import { mockTickets } from "./tickets";

export const mockBoards: Board[] = [
  {
    id: "1",
    title: "Marketing Board",
    description: "Board for marketing tasks",
    logoUrl: "/logos/marketing.png",
    themeColor: "#f3f4f6",
    tickets: mockTickets,
  },
  {
    id: "2",
    title: "Development Board",
    description: "Board for dev tasks",
    logoUrl: "/logos/dev.png",
    themeColor: "#e0f7fa",
    tickets: mockTickets,
  },
];