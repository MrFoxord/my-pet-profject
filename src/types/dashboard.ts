import { ReactNode } from "react";

export type MuiLikeTheme = {
  palette?: {
    background?: { paper?: string };
    action?: { hover?: string };
  };
};

export type BoardDto = {
  id: string;
  title: string;
  description: string | null;
  logoUrl: string | null;
  themeColor: string | null;
  dashboardRole?: string | null;
  tickets: { id: string }[];
};

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
  };
  settings?: {
    visibleColumns?: string[];
    defaultFilter?: string;
    viewMode?: "list" | "grid";
  };
  tickets?: Ticket[];
  currentUserRole?: string | null;
  columns: BoardColumn[];
}

export interface DashboardClientProps {
  board: Board;
  children: ReactNode;
}

export interface BoardPageProps {
  params: Promise<{ boardId: string }>;
}

export interface BoardMockProps {
  id: string;
  title: string;
  logoUrl?: string;
  themeColor?: string;
}

export type TicketAccessPolicy = {
  view: string[];
  edit: string[];
  delete: string[];
  estimate: string[];
  comment: string[];
  manageAccess: string[];
};

export const DEFAULT_ACCESS_POLICY: TicketAccessPolicy = {
  view: [],
  edit: [],
  delete: [],
  estimate: [],
  comment: [],
  manageAccess: [],
};

export interface TicketEstimate {
  originalHours?: number;
  spentHours?: number;
  remainingHours?: number;
  storyPoints?: number;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: "bug" | "feature" | "task";
  priority: "low" | "medium" | "high" | "critical";
  status: "todo" | "in-progress" | "done";
  sortIndex?: number;
  columnId?: string | null;
  accessPolicy: TicketAccessPolicy;
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
  onClick?: (ticket: Ticket) => void;
}

export interface TicketModalProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
  boardRoleNames?: string[];
  onSaveTicket?: (
    ticketId: string,
    payload: {
      description: string;
      status: Ticket["status"];
      priority: Ticket["priority"];
      type: Ticket["type"];
      accessPolicy: TicketAccessPolicy;
    }
  ) => Promise<Ticket | null>;
  onDeleteTicket?: (ticketId: string) => Promise<boolean>;
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
