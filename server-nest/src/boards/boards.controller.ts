import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get()
  findAll(@Query('userId') userId?: string) {
    return this.boardsService.findAll(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateBoardDto) {
    return this.boardsService.create(dto);
  }

  @Get(':id')
  async findById(@Param('id') id: string, @Query('userId') userId?: string) {
    const board = await this.boardsService.findById(id, userId);
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
