import { BoardsService } from './boards.service';
export declare class InvitationsPublicController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    getInvitationByToken(token: string): Promise<{
        id: string;
        token: string;
        type: import("../generated/prisma/enums").InvitationType;
        email: string;
        boardId: string;
        customRoleId: string;
        customRoleName: string;
        createdByUserId: string;
        status: string;
        state: "pending" | "expired" | "revoked" | "limit_reached" | "accepted";
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
    acceptInvitationByToken(token: string, body: {
        userId?: string;
    }): Promise<{
        success: boolean;
        boardId: string;
        alreadyMember: boolean;
    }>;
}
