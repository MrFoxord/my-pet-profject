import { Request } from 'express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { ServiceJwtPayload } from '../auth/internal-auth.guard';
type AuthRequest = Request & {
    serviceUser?: ServiceJwtPayload;
};
export declare class BoardsController {
    private readonly boardsService;
    constructor(boardsService: BoardsService);
    findAll(req: AuthRequest): Promise<{
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
    create(dto: CreateBoardDto, req: AuthRequest): Promise<{
        id: string;
        title: string;
        description: string;
        logoUrl: string;
        themeColor: string;
        dashboardRole: string;
        tickets: any[];
    }>;
    findById(id: string, req: AuthRequest): Promise<{
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
export {};
