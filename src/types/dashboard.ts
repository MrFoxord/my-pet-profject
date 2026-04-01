import { ReactNode } from "react";
import type { TicketPriority, TicketStatus, TicketType } from "@/shared/tickets";

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
  allowPersonalInvites?: boolean;
  allowSharedInvites?: boolean;
  defaultSharedInvitationMode?: "SINGLE_USE" | "MULTI_USE";
  inviteExpiresHours?: number;
  sharedInviteMaxUses?: number;
  dashboardRole?: string | null;
  tickets: { id: string }[];
};

export interface Board {
  id: string;
  title: string;
  description?: string;
  logoUrl?: string;
  themeColor?: string;
  allowPersonalInvites?: boolean;
  allowSharedInvites?: boolean;
  defaultSharedInvitationMode?: "SINGLE_USE" | "MULTI_USE";
  inviteExpiresHours?: number;
  sharedInviteMaxUses?: number;
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
  currentUserCustomRoleName?: string | null;
  currentUserCustomRolePermissions?: TicketPermission[];
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
  fill: string[];
  edit: string[];
  delete: string[];
  estimate: string[];
  comment: string[];
  manageAccess: string[];
};

export type TicketPermission = keyof TicketAccessPolicy;

export const DEFAULT_ACCESS_POLICY: TicketAccessPolicy = {
  view: [],
  fill: [],
  edit: [],
  delete: [],
  estimate: [],
  comment: [],
  manageAccess: [],
};

export interface TicketEstimate {
  originalHours?: number | null;
  spentHours?: number | null;
  remainingHours?: number | null;
  storyPoints?: number | null;
}

export interface Ticket {
  id: string;
  title: string;
  description: string;
  type: TicketType;
  priority: TicketPriority;
  status: TicketStatus;
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
  moveTransitionPhase?: "out" | "in";
  onClick?: (ticket: Ticket) => void;
}

export interface TicketModalProps {
  ticket: Ticket;
  open: boolean;
  onClose: () => void;
  remoteUpdateVersion?: number;
  boardRoleNames?: string[];
  currentUserRole?: string | null;
  currentUserCustomRoleName?: string | null;
  currentUserCustomRolePermissions?: TicketPermission[];
  onSaveTicket?: (
    ticketId: string,
    payload: {
      description?: string;
      status?: Ticket["status"];
      priority?: Ticket["priority"];
      type?: Ticket["type"];
      estimate?: TicketEstimate;
      accessPolicy?: TicketAccessPolicy;
    }
  ) => Promise<Ticket | null>;
  onCreateComment?: (ticketId: string, body: string) => Promise<TicketComment | null>;
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
