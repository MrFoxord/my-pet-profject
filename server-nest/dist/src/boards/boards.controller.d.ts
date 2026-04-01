import { Request } from 'express';
import { BoardsService } from './board-workflow.service';
import { BoardMembersService } from './board-members.service';
import { BoardRolesService } from './board-roles.service';
import { BoardInvitationsService } from './board-invitations.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
import { ServiceJwtPayload } from '../auth/internal-auth.guard';
type AuthRequest = Request & {
    serviceUser?: ServiceJwtPayload;
};
export declare class BoardsController {
    private readonly boardsService;
    private readonly boardMembersService;
    private readonly boardRolesService;
    private readonly boardInvitationsService;
    constructor(boardsService: BoardsService, boardMembersService: BoardMembersService, boardRolesService: BoardRolesService, boardInvitationsService: BoardInvitationsService);
    findAll(req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        allowPersonalInvites: boolean;
        allowSharedInvites: boolean;
        defaultSharedInvitationMode: import("../generated/prisma/enums").SharedInvitationMode;
        inviteExpiresHours: number;
        sharedInviteMaxUses: number;
        dashboardRole: import("../generated/prisma/enums").BoardMemberRole;
        tickets: {
            id: string;
        }[];
    }[]>;
    create(dto: CreateBoardDto, req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        allowPersonalInvites: boolean;
        allowSharedInvites: boolean;
        defaultSharedInvitationMode: string;
        inviteExpiresHours: number;
        sharedInviteMaxUses: number;
        dashboardRole: import("../generated/prisma/enums").BoardMemberRole;
        tickets: any[];
    }>;
    findById(id: string, ticketsOffset: string | undefined, ticketsLimit: string | undefined, req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        allowPersonalInvites: boolean;
        allowSharedInvites: boolean;
        defaultSharedInvitationMode: import("../generated/prisma/enums").SharedInvitationMode;
        inviteExpiresHours: number;
        sharedInviteMaxUses: number;
        currentUserRole: import("../generated/prisma/enums").BoardMemberRole;
        currentUserCustomRoleName: string;
        currentUserCustomRolePermissions: import("./boards.types").TicketPermission[];
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
            accessPolicy: import("./boards.types").TicketAccessPolicy;
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
    updateBoard(boardId: string, dto: UpdateBoardDto, req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        allowPersonalInvites: boolean;
        allowSharedInvites: boolean;
        defaultSharedInvitationMode: import("../generated/prisma/enums").SharedInvitationMode;
        inviteExpiresHours: number;
        sharedInviteMaxUses: number;
        currentUserRole: import("../generated/prisma/enums").BoardMemberRole;
        currentUserCustomRoleName: string;
        currentUserCustomRolePermissions: import("./boards.types").TicketPermission[];
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
            accessPolicy: import("./boards.types").TicketAccessPolicy;
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
    deleteBoard(boardId: string, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    createColumn(boardId: string, dto: CreateColumnDto, req: AuthRequest): Promise<{
        id: string;
        title: string;
        position: number;
    }>;
    reorderColumns(boardId: string, dto: ReorderColumnsDto, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    renameColumn(boardId: string, columnId: string, dto: RenameColumnDto, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    createTicket(boardId: string, dto: CreateTicketDto, req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        priority: string;
        status: string;
        sortIndex: number;
        columnId: string;
        accessPolicy: import("./boards.types").TicketAccessPolicy;
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
    reorderTickets(boardId: string, dto: ReorderTicketsDto, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    getTicketById(boardId: string, ticketId: string, req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        priority: string;
        status: string;
        sortIndex: number;
        columnId: string;
        accessPolicy: import("./boards.types").TicketAccessPolicy;
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
    updateTicket(boardId: string, ticketId: string, dto: UpdateTicketDto, req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        type: string;
        priority: string;
        status: string;
        sortIndex: number;
        columnId: string;
        accessPolicy: import("./boards.types").TicketAccessPolicy;
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
    createTicketComment(boardId: string, ticketId: string, dto: CreateTicketCommentDto, req: AuthRequest): Promise<{
        id: string;
        message: string;
        createdAt: string;
        author: {
            name: string;
            avatar: string;
        };
    }>;
    deleteTicket(boardId: string, ticketId: string, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    listBoardMembers(boardId: string, req: AuthRequest): Promise<{
        id: string;
        boardId: string;
        userId: string;
        role: import("../generated/prisma/enums").BoardMemberRole;
        customRoleId: string;
        customRoleName: string;
        customRolePermissions: string[];
        email: string;
        name: string;
        nickname: string;
    }[]>;
    updateBoardMemberCustomRole(boardId: string, memberId: string, dto: UpdateBoardMemberCustomRoleDto, req: AuthRequest): Promise<{
        id: string;
        boardId: string;
        userId: string;
        role: import("../generated/prisma/enums").BoardMemberRole;
        customRoleId: string;
        customRoleName: string;
        customRolePermissions: string[];
        email: string;
        name: string;
        nickname: string;
    }>;
    leaveBoard(boardId: string, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    removeBoardMember(boardId: string, memberId: string, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    createBoardRole(boardId: string, dto: CreateBoardRoleDto, req: AuthRequest): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        permissions: string[];
    }>;
    listBoardRoles(boardId: string, req: AuthRequest): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        permissions: string[];
    }[]>;
    updateBoardRole(boardId: string, roleId: string, dto: UpdateBoardRoleDto, req: AuthRequest): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        permissions: string[];
    }>;
    deleteBoardRole(boardId: string, roleId: string, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    createBoardInvitation(boardId: string, dto: CreateBoardInvitationDto, req: AuthRequest): Promise<{
        id: string;
        boardId: string;
        type: import("../generated/prisma/enums").InvitationType;
        email: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: import("./boards.types").InvitationState;
        maxUses: number;
        usedCount: number;
        expiresAt: Date;
        createdAt: Date;
        token: string;
        shareUrl: string;
    }>;
    listBoardInvitations(boardId: string, req: AuthRequest): Promise<{
        id: string;
        boardId: string;
        type: import("../generated/prisma/enums").InvitationType;
        email: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: import("./boards.types").InvitationState;
        maxUses: number;
        usedCount: number;
        expiresAt: Date;
        createdAt: Date;
        token: string;
        shareUrl: string;
    }[]>;
    acceptBoardInvitation(boardId: string, invitationId: string, req: AuthRequest): Promise<{
        success: boolean;
        boardId: string;
        alreadyMember: boolean;
    }>;
    revokeBoardInvitation(boardId: string, invitationId: string, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
}
export {};
