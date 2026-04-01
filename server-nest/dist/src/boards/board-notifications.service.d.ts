import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BoardsAccessService } from './boards-access.service';
export declare class BoardNotificationsService {
    private readonly prisma;
    private readonly realtimeGateway;
    private readonly boardsAccessService;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway, boardsAccessService: BoardsAccessService);
    createAndDispatchNotifications(userIds: string[], input: {
        kind: 'board' | 'ticket';
        boardId: string;
        ticketId?: string;
        title: string;
        message: string;
    }): Promise<void>;
    notifyBoardMembers(boardId: string, input: {
        actorUserId?: string;
        title: string;
        message: string;
    }): Promise<void>;
    notifyTicketViewers(boardId: string, ticketId: string, accessPolicy: unknown, input: {
        actorUserId?: string;
        title: string;
        message: string;
    }): Promise<void>;
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
    private getBoardMemberContexts;
    private mapNotification;
}
