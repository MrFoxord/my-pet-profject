import { BoardsService } from './boards.service';
export declare class InvitationsPublicController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    getInvitationByToken(token: string): Promise<{
        board: {
            title: string;
            logoUrl: string;
            id: string;
        };
        status: string;
        id: string;
        email: string;
        role: import("../generated/prisma/enums").BoardMemberRole;
        expiresAt: Date;
    }>;
    acceptInvitationByToken(token: string, body: {
        userId?: string;
        email?: string;
        password?: string;
    }): Promise<{
        success: boolean;
        boardId: string;
    }>;
}
