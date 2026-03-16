import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@Controller('boards')
@UseGuards(InternalAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@Req() req: AuthRequest) {
    return this.boardsService.findAll(req.serviceUser?.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBoardDto, @Req() req: AuthRequest) {
    // ownerId always comes from the verified JWT claim, never from the request body
    return this.boardsService.create({ ...dto, ownerId: req.serviceUser?.sub });
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Req() req: AuthRequest) {
    const board = await this.boardsService.findById(id, req.serviceUser?.sub);
    if (!board) throw new NotFoundException();
    return board;
  }

  // NOTE: order route must be declared before :columnId to prevent shadowing
  @Patch(':boardId/columns/order')
  async reorderColumns(
    @Param('boardId') boardId: string,
    @Body() dto: ReorderColumnsDto,
  ) {
    await this.boardsService.reorderColumns(boardId, dto);
    return { ok: true };
  }

  @Patch(':boardId/columns/:columnId')
  async renameColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() dto: RenameColumnDto,
  ) {
    await this.boardsService.renameColumn(boardId, columnId, dto);
    return { ok: true };
  }

  @Delete(':boardId/columns/:columnId')
  async deleteColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() dto: DeleteColumnDto,
  ) {
    await this.boardsService.deleteColumn(boardId, columnId, dto);
    return { ok: true };
  }
}
