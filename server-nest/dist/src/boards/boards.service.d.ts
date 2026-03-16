import { PrismaService } from '../prisma/prisma.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
export declare class BoardsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        dashboardRole: string;
        tickets: {
            id: string;
        }[];
    }[]>;
    findById(boardId: string, userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        currentUserRole: string;
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
        }[];
    }>;
    create(dto: CreateBoardDto): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        dashboardRole: string;
        tickets: any[];
    }>;
    reorderColumns(boardId: string, dto: ReorderColumnsDto): Promise<void>;
    renameColumn(boardId: string, columnId: string, dto: RenameColumnDto): Promise<void>;
    deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto): Promise<void>;
    private generateBoardId;
    private normalizeColumnTitles;
}
