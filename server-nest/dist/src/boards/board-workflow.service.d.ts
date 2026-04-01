import { BoardMemberRole, SharedInvitationMode } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BoardsAccessService } from './boards-access.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardStructureService } from './board-structure.service';
import { BoardTicketsService } from './board-tickets.service';
import { FindBoardOptions } from './boards.types';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { UpdateBoardDto } from './dto/update-board.dto';
export declare class BoardsService {
    private readonly prisma;
    private readonly realtimeGateway;
    private readonly boardsAccessService;
    private readonly boardNotificationsService;
    private readonly boardStructureService;
    private readonly boardTicketsService;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway, boardsAccessService: BoardsAccessService, boardNotificationsService: BoardNotificationsService, boardStructureService: BoardStructureService, boardTicketsService: BoardTicketsService);
    findAll(userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        allowPersonalInvites: boolean;
        allowSharedInvites: boolean;
        defaultSharedInvitationMode: SharedInvitationMode;
        inviteExpiresHours: number;
        sharedInviteMaxUses: number;
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
        allowPersonalInvites: boolean;
        allowSharedInvites: boolean;
        defaultSharedInvitationMode: SharedInvitationMode;
        inviteExpiresHours: number;
        sharedInviteMaxUses: number;
        currentUserRole: BoardMemberRole;
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
    create(dto: CreateBoardDto): Promise<{
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
        dashboardRole: BoardMemberRole;
        tickets: any[];
    }>;
    updateBoard(boardId: string, dto: UpdateBoardDto, userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        allowPersonalInvites: boolean;
        allowSharedInvites: boolean;
        defaultSharedInvitationMode: SharedInvitationMode;
        inviteExpiresHours: number;
        sharedInviteMaxUses: number;
        currentUserRole: BoardMemberRole;
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
    getTicketById(boardId: string, ticketId: string, userId?: string): Promise<{
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
    private normalizeColumnTitles;
    private normalizeRoleTitles;
    private emitBoardStateChanged;
}
