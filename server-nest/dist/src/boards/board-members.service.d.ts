import { BoardMemberRole } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardsAccessService } from './boards-access.service';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';
export declare class BoardMembersService {
    private readonly prisma;
    private readonly boardsAccessService;
    private readonly boardNotificationsService;
    constructor(prisma: PrismaService, boardsAccessService: BoardsAccessService, boardNotificationsService: BoardNotificationsService);
    listBoardMembers(boardId: string, userId?: string): Promise<{
        id: string;
        boardId: string;
        userId: string;
        role: BoardMemberRole;
        customRoleId: string;
        customRoleName: string;
        customRolePermissions: string[];
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
        customRolePermissions: string[];
        email: string;
        name: string;
        nickname: string;
    }>;
    leaveBoard(boardId: string, userId?: string): Promise<void>;
    removeBoardMember(boardId: string, memberId: string, userId?: string): Promise<void>;
}
