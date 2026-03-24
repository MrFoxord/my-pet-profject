import { BoardMemberRole, InvitationType } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';
import { RealtimeGateway } from '../realtime/realtime.gateway';
type TicketAccessPolicy = {
    view: string[];
    fill: string[];
    edit: string[];
    delete: string[];
    estimate: string[];
    comment: string[];
    manageAccess: string[];
};
type InvitationState = 'pending' | 'expired' | 'revoked' | 'limit_reached' | 'accepted';
type FindBoardOptions = {
    ticketsOffset?: number;
    ticketsLimit?: number;
};
export declare class BoardsService {
    private readonly prisma;
    private readonly realtimeGateway;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway);
    private readonly standardTicketAccessRoles;
    private formatEstimateValue;
    private buildEstimateChangeComment;
    private mapNotification;
    private createAndDispatchNotifications;
    private getBoardMemberContexts;
    private emitBoardStateChanged;
    private emitTicketStateChanged;
    private notifyBoardMembers;
    private notifyTicketViewers;
    listUserNotifications(userId?: string): Promise<{
        unreadCount: number;
        items: {
            id: string;
            kind: "board" | "ticket";
            boardId: string;
            ticketId: string;
            title: string;
            message: string;
            isRead: boolean;
            createdAt: string;
        }[];
    }>;
    markNotificationRead(notificationId: string, userId?: string): Promise<{
        ok: boolean;
        unreadCount: number;
    }>;
    markAllNotificationsRead(userId?: string): Promise<{
        ok: boolean;
        unreadCount: number;
    }>;
    private mapTicketComment;
    private mapTicket;
    private normalizeTicketAccessPolicy;
    private canUseTicketPermission;
    findAll(userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        dashboardRole: BoardMemberRole;
        tickets: {
            id: string;
        }[];
    }[]>;
    findById(boardId: string, userId?: string, options?: FindBoardOptions): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        currentUserRole: BoardMemberRole;
        currentUserCustomRoleName: string;
        columns: {
            id: string;
            title: string;
            position: number;
        }[];
        tickets: {
            id: string;
            title: string;
            description: string;
            type: string;
            priority: string;
            status: string;
            sortIndex: number;
            columnId: string;
            accessPolicy: TicketAccessPolicy;
            createdAt: string;
            updatedAt: string;
            dueDate: string;
            assignee: {
                name: string;
                avatar: string;
            };
            subtasks: {
                id: string;
                title: string;
                done: boolean;
            }[];
            comments: {
                id: string;
                message: string;
                createdAt: string;
                author: {
                    name: string;
                    avatar: string;
                };
            }[];
            estimate: {
                originalHours: number;
                spentHours: number;
                remainingHours: number;
                storyPoints: number;
            };
        }[];
    }>;
    create(dto: CreateBoardDto): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        dashboardRole: BoardMemberRole;
        tickets: any[];
    }>;
    deleteBoard(boardId: string, userId?: string): Promise<void>;
    reorderColumns(boardId: string, dto: ReorderColumnsDto, userId?: string): Promise<void>;
    createColumn(boardId: string, dto: CreateColumnDto, userId?: string): Promise<{
        id: string;
        title: string;
        position: number;
    }>;
    renameColumn(boardId: string, columnId: string, dto: RenameColumnDto, userId?: string): Promise<void>;
    deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto, userId?: string): Promise<void>;
    createTicket(boardId: string, dto: CreateTicketDto, userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        priority: string;
        status: string;
        sortIndex: number;
        columnId: string;
        accessPolicy: TicketAccessPolicy;
        createdAt: string;
        updatedAt: string;
        dueDate: string;
        assignee: {
            name: string;
            avatar: string;
        };
        subtasks: {
            id: string;
            title: string;
            done: boolean;
        }[];
        comments: {
            id: string;
            message: string;
            createdAt: string;
            author: {
                name: string;
                avatar: string;
            };
        }[];
        estimate: {
            originalHours: number;
            spentHours: number;
            remainingHours: number;
            storyPoints: number;
        };
    }>;
    getTicketById(boardId: string, ticketId: string, userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        priority: string;
        status: string;
        sortIndex: number;
        columnId: string;
        accessPolicy: TicketAccessPolicy;
        createdAt: string;
        updatedAt: string;
        dueDate: string;
        assignee: {
            name: string;
            avatar: string;
        };
        subtasks: {
            id: string;
            title: string;
            done: boolean;
        }[];
        comments: {
            id: string;
            message: string;
            createdAt: string;
            author: {
                name: string;
                avatar: string;
            };
        }[];
        estimate: {
            originalHours: number;
            spentHours: number;
            remainingHours: number;
            storyPoints: number;
        };
    }>;
    reorderTickets(boardId: string, dto: ReorderTicketsDto, userId?: string): Promise<void>;
    updateTicket(boardId: string, ticketId: string, dto: UpdateTicketDto, userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        priority: string;
        status: string;
        sortIndex: number;
        columnId: string;
        accessPolicy: TicketAccessPolicy;
        createdAt: string;
        updatedAt: string;
        dueDate: string;
        assignee: {
            name: string;
            avatar: string;
        };
        subtasks: {
            id: string;
            title: string;
            done: boolean;
        }[];
        comments: {
            id: string;
            message: string;
            createdAt: string;
            author: {
                name: string;
                avatar: string;
            };
        }[];
        estimate: {
            originalHours: number;
            spentHours: number;
            remainingHours: number;
            storyPoints: number;
        };
    }>;
    createTicketComment(boardId: string, ticketId: string, dto: CreateTicketCommentDto, userId?: string): Promise<{
        id: string;
        message: string;
        createdAt: string;
        author: {
            name: string;
            avatar: string;
        };
    }>;
    deleteTicket(boardId: string, ticketId: string, userId?: string): Promise<void>;
    private generateBoardId;
    private generateInvitationToken;
    private getInvitationExpiryDate;
    private getSharedInvitationMaxUses;
    private getInvitationState;
    private ensureInvitationCanBeAccepted;
    private mapInvitation;
    private resolveInvitationCustomRole;
    private acceptInvitationRecord;
    private normalizeColumnTitles;
    private normalizeRoleTitles;
    private ensureBoardMembership;
    private canAccessTicket;
    private canManageTicketAccess;
    private getEffectiveTicketRoles;
    listBoardMembers(boardId: string, userId?: string): Promise<{
        id: string;
        boardId: string;
        userId: string;
        role: BoardMemberRole;
        customRoleId: string;
        customRoleName: string;
        email: string;
        name: string;
        nickname: string;
    }[]>;
    updateBoardMemberCustomRole(boardId: string, memberId: string, dto: UpdateBoardMemberCustomRoleDto, userId?: string): Promise<{
        id: string;
        boardId: string;
        userId: string;
        role: BoardMemberRole;
        customRoleId: string;
        customRoleName: string;
        email: string;
        name: string;
        nickname: string;
    }>;
    leaveBoard(boardId: string, userId?: string): Promise<void>;
    removeBoardMember(boardId: string, memberId: string, userId?: string): Promise<void>;
    createBoardRole(boardId: string, dto: CreateBoardRoleDto, userId?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        permissions: string[];
    }>;
    updateBoardRole(boardId: string, roleId: string, dto: UpdateBoardRoleDto, userId?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        permissions: string[];
    }>;
    deleteBoardRole(boardId: string, roleId: string, userId?: string): Promise<void>;
    listBoardRoles(boardId: string, userId?: string): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        permissions: string[];
    }[]>;
    createBoardInvitation(boardId: string, dto: CreateBoardInvitationDto, userId?: string): Promise<{
        id: string;
        boardId: string;
        type: InvitationType;
        email: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: InvitationState;
        maxUses: number;
        usedCount: number;
        expiresAt: Date;
        createdAt: Date;
        token: string;
        shareUrl: string;
    }>;
    listBoardInvitations(boardId: string, userId?: string): Promise<{
        id: string;
        boardId: string;
        type: InvitationType;
        email: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: InvitationState;
        maxUses: number;
        usedCount: number;
        expiresAt: Date;
        createdAt: Date;
        token: string;
        shareUrl: string;
    }[]>;
    acceptBoardInvitation(boardId: string, invitationId: string, userId?: string): Promise<{
        success: boolean;
        boardId: string;
        alreadyMember: boolean;
    }>;
    revokeBoardInvitation(boardId: string, invitationId: string, userId?: string): Promise<void>;
    getInvitationByToken(token: string): Promise<{
        id: string;
        token: string;
        type: InvitationType;
        email: string;
        boardId: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: InvitationState;
        maxUses: number;
        usedCount: number;
        expiresAt: Date;
        createdAt: Date;
        board: {
            id: string;
            title: string;
            logoUrl: string;
        };
    }>;
    acceptInvitationByToken(token: string, userId?: string): Promise<{
        success: boolean;
        boardId: string;
        alreadyMember: boolean;
    }>;
}
export {};
