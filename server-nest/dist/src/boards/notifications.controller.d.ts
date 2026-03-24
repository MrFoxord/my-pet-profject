import { Request } from 'express';
import { ServiceJwtPayload } from '../auth/internal-auth.guard';
import { BoardsService } from './boards.service';
type AuthRequest = Request & {
    serviceUser?: ServiceJwtPayload;
};
export declare class NotificationsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    list(req: AuthRequest): Promise<{
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
    markAllAsRead(req: AuthRequest): Promise<{
        ok: boolean;
        unreadCount: number;
    }>;
    markAsRead(notificationId: string, req: AuthRequest): Promise<{
        ok: boolean;
        unreadCount: number;
    }>;
}
export {};
