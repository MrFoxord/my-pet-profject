import { Request } from 'express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';
import { ServiceJwtPayload } from '../auth/internal-auth.guard';
type AuthRequest = Request & {
    serviceUser?: ServiceJwtPayload;
};
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    findAll(req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
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
        dashboardRole: import("../generated/prisma/enums").BoardMemberRole;
        tickets: any[];
    }>;
    findById(id: string, req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        currentUserRole: import("../generated/prisma/enums").BoardMemberRole;
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
            accessibilityRoles: string[];
            accessibilityIds: string[];
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
    reorderColumns(boardId: string, dto: ReorderColumnsDto): Promise<{
        ok: boolean;
    }>;
    renameColumn(boardId: string, columnId: string, dto: RenameColumnDto): Promise<{
        ok: boolean;
    }>;
    deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto): Promise<{
        ok: boolean;
    }>;
    createTicket(boardId: string, dto: CreateTicketDto, req: AuthRequest): Promise<{
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
        accessibilityRoles: string[];
        accessibilityIds: string[];
        sortIndex: number;
        id: string;
    }>;
    reorderTickets(boardId: string, dto: ReorderTicketsDto, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    updateTicket(boardId: string, ticketId: string, dto: UpdateTicketDto, req: AuthRequest): Promise<{
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
        accessibilityRoles: string[];
        accessibilityIds: string[];
        sortIndex: number;
        id: string;
    }>;
    deleteTicket(boardId: string, ticketId: string, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    createBoardRole(boardId: string, dto: CreateBoardRoleDto, req: AuthRequest): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        name: string;
        permissions: string[];
    }>;
    listBoardRoles(boardId: string, req: AuthRequest): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        name: string;
        permissions: string[];
    }[]>;
    updateBoardRole(boardId: string, roleId: string, dto: UpdateBoardRoleDto, req: AuthRequest): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        boardId: string;
        name: string;
        permissions: string[];
    }>;
    deleteBoardRole(boardId: string, roleId: string, req: AuthRequest): Promise<void>;
    createBoardInvitation(boardId: string, dto: CreateBoardInvitationDto, req: AuthRequest): Promise<{
        status: string;
        id: string;
        email: string;
        role: import("../generated/prisma/enums").BoardMemberRole;
        createdAt: Date;
        boardId: string;
        expiresAt: Date;
    }>;
    listBoardInvitations(boardId: string, req: AuthRequest): Promise<{
        status: string;
        id: string;
        email: string;
        role: import("../generated/prisma/enums").BoardMemberRole;
        createdAt: Date;
        boardId: string;
        expiresAt: Date;
    }[]>;
    acceptBoardInvitation(boardId: string, invitationId: string, req: AuthRequest): Promise<{
        ok: boolean;
    }>;
    revokeBoardInvitation(boardId: string, invitationId: string, req: AuthRequest): Promise<void>;
}
export {};
