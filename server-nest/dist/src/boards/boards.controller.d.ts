import { Request } from 'express';
import { BoardsService } from './board-workflow.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
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
}
export {};
