import { Task,BoardMockProps } from "@/types";

export const mockTasks: Task[] = [
  { id: "1", title: "Сделать дизайн", status: "todo", assignedTo: "Иван", dueDate: "2025-11-30" },
  { id: "2", title: "Настроить базу", status: "in-progress", assignedTo: "Мария", dueDate: "2025-12-05" },
  { id: "3", title: "Написать документацию", status: "done", assignedTo: "Алексей", dueDate: "2025-11-25" },
];

export const mockBoards: BoardMockProps[] = [
  {
    id: "board-1",
    title: "Marketing Dashboard",
    logoUrl: "/logos/marketing.png",
    themeColor: "#1E88E5",
  },
  {
    id: "board-2",
    title: "Sales Dashboard",
    logoUrl: "/logos/sales.png",
    themeColor: "#43A047",
  },
  {
    id: "board-3",
    title: "Product Dashboard",
    logoUrl: "/logos/product.png",
    themeColor: "#F4511E",
  },
  {
    id: "board-4",
    title: "Finance Dashboard",
    logoUrl: "/logos/finance.png",
    themeColor: "#8E24AA",
  },
  {
    id: "board-5",
    title: "HR Dashboard",
    logoUrl: "/logos/hr.png",
    themeColor: "#FFB300",
  },
];