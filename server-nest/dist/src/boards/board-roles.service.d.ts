import { PrismaService } from '../prisma/prisma.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardsAccessService } from './boards-access.service';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';
export declare class BoardRolesService {
    private readonly prisma;
    private readonly boardsAccessService;
    private readonly boardNotificationsService;
    constructor(prisma: PrismaService, boardsAccessService: BoardsAccessService, boardNotificationsService: BoardNotificationsService);
    private ensureCanManageRoles;
    createBoardRole(boardId: string, dto: CreateBoardRoleDto, userId?: string): Promise<{
        id: string;
        boardId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        permissions: string[];
    }>;
    updateBoardRole(boardId: string, roleId: string, dto: UpdateBoardRoleDto, userId?: string): Promise<{
        id: string;
        boardId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        permissions: string[];
    }>;
    deleteBoardRole(boardId: string, roleId: string, userId?: string): Promise<void>;
    listBoardRoles(boardId: string, userId?: string): Promise<{
        id: string;
        boardId: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        permissions: string[];
    }[]>;
}
