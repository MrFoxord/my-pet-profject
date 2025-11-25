import { ReactNode } from "react";

export interface Task {
    id: string;
    title: string;
    status: "todo" | "in-progress" | "done";
    dueDate: string;
    assignedTo: string;
}
export interface Board {
    id: string;
    title: string;
    description?: string;
    logoUrl?: string;
    themeColor?: string;
    stats?: {
        totalTasks: number;
        completedTasks: number;
        activeTasks: number;
    },
    settings?: {
        visibleColumns?: string[];
        defaultFilter?: string;
        viewMode?: 'list' | 'grid';
    };
    tickets?: Ticket[];
}

export interface DashboardClientProps {
  board: Board;
  children: ReactNode;
}

export interface BoardPageProps {
  params: { boardId: string };
}

export interface BoardMockProps {
  id: string;
  title: string;
  logoUrl?: string;
  themeColor?: string;
}

export interface TaskItemProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: Task["status"]) => void;
}

export interface TaskListProps {
  tasks: Task[];
}

export interface Ticket {
  id: string;
  title: string;
  type: "bug" | "feature" | "task";
  priority: "low" | "medium" | "high";
  
  assignee: {
    id: number;
    name: string;
    avatar: string;
  };

  subtasks: {
    id: string;
    title: string;
    done: boolean;
  }[];
}

export interface TickerCardProps {
  ticket: Ticket;
  onRender?: () => void;
}

export interface TicketListProps {
  tickets: Ticket[];
  onTicketRendered?: () => void;
}