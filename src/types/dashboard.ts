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
    }
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