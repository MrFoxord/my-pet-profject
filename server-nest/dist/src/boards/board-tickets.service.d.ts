import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BoardsAccessService } from './boards-access.service';
import { BoardNotificationsService } from './board-notifications.service';
import { TicketRecord } from './boards.types';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
export declare class BoardTicketsService {
    private readonly prisma;
    private readonly realtimeGateway;
    private readonly boardsAccessService;
    private readonly boardNotificationsService;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway, boardsAccessService: BoardsAccessService, boardNotificationsService: BoardNotificationsService);
    getTicketSelect(): {
        readonly id: true;
        readonly title: true;
        readonly description: true;
        readonly status: true;
        readonly sortIndex: true;
        readonly priority: true;
        readonly type: true;
        readonly columnId: true;
        readonly accessPolicy: true;
        readonly createdAt: true;
        readonly updatedAt: true;
        readonly dueDate: true;
        readonly estimateOriginalHours: true;
        readonly estimateSpentHours: true;
        readonly estimateRemainingHours: true;
        readonly storyPoints: true;
        readonly subtasks: {
            readonly orderBy: {
                readonly id: "asc";
            };
            readonly select: {
                readonly id: true;
                readonly title: true;
                readonly done: true;
            };
        };
        readonly comments: {
            readonly orderBy: {
                readonly createdAt: "desc";
            };
            readonly select: {
                readonly id: true;
                readonly body: true;
                readonly createdAt: true;
                readonly author: {
                    readonly select: {
                        readonly name: true;
                        readonly nickname: true;
                        readonly email: true;
                        readonly image: true;
                    };
                };
            };
        };
    };
    mapTicket(ticket: TicketRecord): {
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
    };
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
    private formatEstimateValue;
    private buildEstimateChangeComment;
    private mapTicketComment;
    private emitBoardStateChanged;
    private emitTicketStateChanged;
}
