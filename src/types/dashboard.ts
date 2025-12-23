import { ReactNode } from "react";
export type MuiLikeTheme = {
  palette?: {
    background?: { paper?: string };
    action?: { hover?: string };
  };
};
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
    columns: BoardColumn[];
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

export interface TicketEstimate {
  originalHours?: number;   // исходная оценка
  spentHours?: number;      // затрачено
  remainingHours?: number;  // осталось
  storyPoints?: number;     // story points, если нужны
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: "bug" | "feature" | "task";
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "done";
  createdAt: string;
  dueDate?: string;
  updatedAt?: string;
  relatedTicketIds?: string[];
  assignee: {
      name: string;
      avatar: string;
  };
  subtasks: { id: string; title: string; done: boolean }[];
  comments?: TicketComment[];
  estimate?: TicketEstimate;
}
export interface BoardColumn {
  id: string;
  title: string;
  ticketIds: string[];
}
export interface TickerCardProps {
  ticket: Ticket;
  onRender?: () => void;
  onClick?: (ticket: Ticket) => void;
}

export interface TicketListProps {
  tickets: Ticket[];
  onTicketRendered?: () => void;
  onTicketClick?: (ticket: Ticket) => void;
}

export interface TicketModalProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
}

export interface TicketComment {
    id: string;
    author: {
        name: string;
        avatar: string;
    };
    message: string;
    createdAt: string;
}