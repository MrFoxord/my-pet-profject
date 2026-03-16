import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
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
    create(dto: CreateBoardDto): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        dashboardRole: string;
        tickets: any[];
    }>;
    findById(id: string, userId?: string): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        currentUserRole: string;
        columns: {
            title: string;
            id: string;
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
                title: string;
                id: string;
                done: boolean;
            }[];
        }[];
    }>;
    reorderColumns(boardId: string, dto: ReorderColumnsDto): Promise<{
        ok: boolean;
    }>;
    renameColumn(boardId: string, columnId: string, dto: RenameColumnDto): Promise<{
        ok: boolean;
    }>;
    deleteColumn(boardId: string, columnId: string, dto: DeleteColumnDto): Promise<{
        ok: boolean;
    }>;
}
