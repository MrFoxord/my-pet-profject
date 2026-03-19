import { BoardMemberRole } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';
export declare class BoardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private readonly standardTicketAccessRoles;
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
    findById(boardId: string, userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        currentUserRole: BoardMemberRole;
        columns: {
            title: string;
            id: string;
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
            accessPolicy: import("@prisma/client/runtime/client").JsonValue;
            createdAt: string;
            updatedAt: string;
            dueDate: string;
            assignee: {
                name: string;
                avatar: string;
            };
            subtasks: {
                title: string;
                id: string;
                done: boolean;
            }[];
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
    reorderColumns(boardId: string, dto: ReorderColumnsDto): Promise<void>;
    renameColumn(boardId: string, columnId: string, dto: RenameColumnDto): Promise<void>;
    deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto): Promise<void>;
    createTicket(boardId: string, dto: CreateTicketDto, userId?: string): Promise<{
        description: string;
        createdAt: string;
        updatedAt: string;
        assignee: {
            name: string;
            avatar: string;
        };
        subtasks: any[];
        dueDate: string;
        title: string;
        status: string;
        type: string;
        priority: string;
        columnId: string;
        accessPolicy: import("@prisma/client/runtime/client").JsonValue;
        sortIndex: number;
        id: string;
    }>;
    reorderTickets(boardId: string, dto: ReorderTicketsDto, userId?: string): Promise<void>;
    updateTicket(boardId: string, ticketId: string, dto: UpdateTicketDto, userId?: string): Promise<{
        description: string;
        createdAt: string;
        updatedAt: string;
        assignee: {
            name: string;
            avatar: string;
        };
        subtasks: any[];
        dueDate: string;
        title: string;
        status: string;
        type: string;
        priority: string;
        columnId: string;
        accessPolicy: import("@prisma/client/runtime/client").JsonValue;
        sortIndex: number;
        id: string;
    }>;
    deleteTicket(boardId: string, ticketId: string, userId?: string): Promise<void>;
    private generateBoardId;
    private generateInvitationToken;
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
    createBoardRole(boardId: string, dto: any, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        name: string;
        permissions: string[];
    }>;
    updateBoardRole(boardId: string, roleId: string, dto: any, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        name: string;
        permissions: string[];
    }>;
    deleteBoardRole(boardId: string, roleId: string, userId?: string): Promise<void>;
    listBoardRoles(boardId: string, userId?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        name: string;
        permissions: string[];
    }[]>;
    createBoardInvitation(boardId: string, dto: CreateBoardInvitationDto, userId?: string): Promise<{
        id: string;
        email: string;
        role: BoardMemberRole;
        status: string;
        expiresAt: Date;
        token: string;
        shareUrl: string;
    }>;
    listBoardInvitations(boardId: string, userId?: string): Promise<{
        status: string;
        id: string;
        email: string;
        role: BoardMemberRole;
        createdAt: Date;
        boardId: string;
        token: string;
        expiresAt: Date;
    }[]>;
    acceptBoardInvitation(boardId: string, invitationId: string, userId?: string): Promise<{
        ok: boolean;
    }>;
    revokeBoardInvitation(boardId: string, invitationId: string, userId?: string): Promise<void>;
    getInvitationByToken(token: string): Promise<{
        board: {
            title: string;
            logoUrl: string;
            id: string;
        };
        status: string;
        id: string;
        email: string;
        role: BoardMemberRole;
        expiresAt: Date;
    }>;
    acceptInvitationByToken(token: string, userId?: string): Promise<{
        success: boolean;
        boardId: string;
    }>;
}
