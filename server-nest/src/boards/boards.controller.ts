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
  Query,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BoardsService } from './board-workflow.service';

import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';




import { UpdateBoardDto } from './dto/update-board.dto';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Boards')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('boards')
@UseGuards(InternalAuthGuard)
export class BoardsController {
  constructor(
    private readonly boardsService: BoardsService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List boards available to current user' })
  @ApiOkResponse({ description: 'Boards list' })
  findAll(@Req() req: AuthRequest) {
    return this.boardsService.findAll(req.serviceUser?.sub);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new board' })
  @ApiBody({ type: CreateBoardDto })
  @ApiCreatedResponse({ description: 'Board created' })
  create(@Body() dto: CreateBoardDto, @Req() req: AuthRequest) {
    // ownerId always comes from the verified JWT claim, never from the request body
    return this.boardsService.create({ ...dto, ownerId: req.serviceUser?.sub });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get board by ID' })
  @ApiParam({ name: 'id', description: 'Board ID' })
  @ApiOkResponse({ description: 'Board details' })
  @ApiNotFoundResponse({ description: 'Board not found' })
  async findById(
    @Param('id') id: string,
    @Query('ticketsOffset') ticketsOffset: string | undefined,
    @Query('ticketsLimit') ticketsLimit: string | undefined,
    @Req() req: AuthRequest,
  ) {
    const offset = Number.parseInt(ticketsOffset ?? '0', 10);
    const limit = Number.parseInt(ticketsLimit ?? '100', 10);

    const board = await this.boardsService.findById(id, req.serviceUser?.sub, {
      ticketsOffset: Number.isFinite(offset) ? offset : 0,
      ticketsLimit: Number.isFinite(limit) ? limit : 100,
    });

    if (!board) throw new NotFoundException();
    return board;
  }

  @Patch(':boardId')
  @ApiOperation({ summary: 'Update board settings' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiBody({ type: UpdateBoardDto })
  @ApiOkResponse({ description: 'Board settings updated' })
  updateBoard(
    @Param('boardId') boardId: string,
    @Body() dto: UpdateBoardDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.updateBoard(boardId, dto, req.serviceUser?.sub);
  }

  @Delete(':boardId')
  @ApiOperation({ summary: 'Delete board' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiOkResponse({
    description: 'Board deleted',
    schema: { example: { ok: true } },
  })
  async deleteBoard(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.deleteBoard(boardId, req.serviceUser?.sub);
    return { ok: true };
  }

  // NOTE: order route must be declared before :columnId to prevent shadowing
  @Post(':boardId/columns')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create board column' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiBody({ type: CreateColumnDto })
  @ApiCreatedResponse({ description: 'Column created' })
  createColumn(
    @Param('boardId') boardId: string,
    @Body() dto: CreateColumnDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.createColumn(boardId, dto, req.serviceUser?.sub);
  }

  @Patch(':boardId/columns/order')
  @ApiOperation({ summary: 'Reorder board columns' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiBody({ type: ReorderColumnsDto })
  @ApiOkResponse({
    description: 'Columns reordered',
    schema: { example: { ok: true } },
  })
  async reorderColumns(
    @Param('boardId') boardId: string,
    @Body() dto: ReorderColumnsDto,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.reorderColumns(boardId, dto, req.serviceUser?.sub);
    return { ok: true };
  }

  @Patch(':boardId/columns/:columnId')
  @ApiOperation({ summary: 'Rename board column' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'columnId', description: 'Column ID' })
  @ApiBody({ type: RenameColumnDto })
  @ApiOkResponse({
    description: 'Column renamed',
    schema: { example: { ok: true } },
  })
  async renameColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() dto: RenameColumnDto,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.renameColumn(boardId, columnId, dto, req.serviceUser?.sub);
    return { ok: true };
  }

  @Delete(':boardId/columns/:columnId')
  @ApiOperation({ summary: 'Delete board column' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'columnId', description: 'Column ID' })
  @ApiBody({ type: DeleteColumnDto, required: false })
  @ApiOkResponse({
    description: 'Column deleted',
    schema: { example: { ok: true } },
  })
  async deleteColumn(
    @Param('boardId') boardId: string,
    @Param('columnId') columnId: string,
    @Body() dto: DeleteColumnDto,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.deleteColumn(boardId, columnId, dto, req.serviceUser?.sub);
    return { ok: true };
  }



}
