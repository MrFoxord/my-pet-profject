import { PrismaService } from '../prisma/prisma.service';
import { RealtimeGateway } from '../realtime/realtime.gateway';
import { BoardsAccessService } from './boards-access.service';
import { BoardNotificationsService } from './board-notifications.service';
import { CreateColumnDto } from './dto/create-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
export declare class BoardStructureService {
    private readonly prisma;
    private readonly realtimeGateway;
    private readonly boardsAccessService;
    private readonly boardNotificationsService;
    constructor(prisma: PrismaService, realtimeGateway: RealtimeGateway, boardsAccessService: BoardsAccessService, boardNotificationsService: BoardNotificationsService);
    reorderColumns(boardId: string, dto: ReorderColumnsDto, userId?: string): Promise<void>;
    createColumn(boardId: string, dto: CreateColumnDto, userId?: string): Promise<{
        id: string;
        title: string;
        position: number;
    }>;
    renameColumn(boardId: string, columnId: string, dto: RenameColumnDto, userId?: string): Promise<void>;
    deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto, userId?: string): Promise<void>;
    private emitBoardStateChanged;
}
