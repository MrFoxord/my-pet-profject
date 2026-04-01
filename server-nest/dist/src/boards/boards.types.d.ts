import { BoardMemberRole, InvitationType } from '../generated/prisma/client';
export type BoardMembershipContext = {
    role: BoardMemberRole;
    customRoleName: string | null;
    customRolePermissions: TicketPermission[];
};
export type BoardMembershipLike = {
    role: BoardMemberRole | null;
    customRoleName: string | null;
    customRolePermissions: TicketPermission[];
};
export type TicketAccessPolicy = {
    view: string[];
    fill: string[];
    edit: string[];
    delete: string[];
    estimate: string[];
    comment: string[];
    manageAccess: string[];
};
export type TicketPermission = 'view' | 'fill' | 'edit' | 'delete' | 'estimate' | 'comment' | 'manageAccess';
export declare const ALL_TICKET_PERMISSIONS: TicketPermission[];
export type InvitationState = 'pending' | 'expired' | 'revoked' | 'limit_reached' | 'accepted';
export type InvitationRecord = {
    id: string;
    token: string;
    type: InvitationType;
    email: string | null;
    boardId: string;
    customRoleId: string | null;
    customRoleName: string | null;
    createdByUserId: string | null;
    status: string;
    maxUses: number;
    usedCount: number;
    expiresAt: Date;
    createdAt: Date;
};
export type TicketCommentRecord = {
    id: string;
    body: string;
    createdAt: Date;
    author: {
        name: string | null;
        nickname: string | null;
        email: string | null;
        image: string | null;
    } | null;
};
export type TicketRecord = {
    id: string;
    title: string;
    description: string | null;
    status: string;
    sortIndex: number;
    priority: string;
    type: string;
    columnId: string | null;
    accessPolicy: unknown;
    createdAt: Date;
    updatedAt: Date;
    dueDate: Date | null;
    estimateOriginalHours: number | null;
    estimateSpentHours: number | null;
    estimateRemainingHours: number | null;
    storyPoints: number | null;
    subtasks: {
        id: string;
        title: string;
        done: boolean;
    }[];
    comments: TicketCommentRecord[];
};
export type NotificationRecord = {
    id: string;
    kind: string;
    boardId: string;
    ticketId: string | null;
    title: string;
    message: string;
    isRead: boolean;
    createdAt: Date;
};
export type EstimateFieldChange = {
    label: string;
    previous: number | null;
    next: number | null;
};
export type FindBoardOptions = {
    ticketsOffset?: number;
    ticketsLimit?: number;
};
