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
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';
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

  @Post(':boardId/tickets')
  @HttpCode(HttpStatus.CREATED)
  createTicket(
    @Param('boardId') boardId: string,
    @Body() dto: CreateTicketDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.createTicket(boardId, dto, req.serviceUser?.sub);
  }

  @Patch(':boardId/tickets/reorder')
  async reorderTickets(
    @Param('boardId') boardId: string,
    @Body() dto: ReorderTicketsDto,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.reorderTickets(boardId, dto, req.serviceUser?.sub);
    return { ok: true };
  }

  @Patch(':boardId/tickets/:ticketId')
  updateTicket(
    @Param('boardId') boardId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: UpdateTicketDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.updateTicket(boardId, ticketId, dto, req.serviceUser?.sub);
  }

  @Delete(':boardId/tickets/:ticketId')
  async deleteTicket(
    @Param('boardId') boardId: string,
    @Param('ticketId') ticketId: string,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.deleteTicket(boardId, ticketId, req.serviceUser?.sub);
    return { ok: true };
  }

  @Get(':boardId/members')
  listBoardMembers(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.listBoardMembers(boardId, req.serviceUser?.sub);
  }

  @Patch(':boardId/members/:memberId/custom-role')
  updateBoardMemberCustomRole(
    @Param('boardId') boardId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateBoardMemberCustomRoleDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.updateBoardMemberCustomRole(boardId, memberId, dto, req.serviceUser?.sub);
  }

  @Post(':boardId/roles')
  @HttpCode(HttpStatus.CREATED)
  createBoardRole(
    @Param('boardId') boardId: string,
    @Body() dto: CreateBoardRoleDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.createBoardRole(boardId, dto, req.serviceUser?.sub);
  }

  @Get(':boardId/roles')
  listBoardRoles(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.listBoardRoles(boardId, req.serviceUser?.sub);
  }

  @Patch(':boardId/roles/:roleId')
  updateBoardRole(
    @Param('boardId') boardId: string,
    @Param('roleId') roleId: string,
    @Body() dto: UpdateBoardRoleDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.updateBoardRole(boardId, roleId, dto, req.serviceUser?.sub);
  }

  @Delete(':boardId/roles/:roleId')
  deleteBoardRole(
    @Param('boardId') boardId: string,
    @Param('roleId') roleId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.deleteBoardRole(boardId, roleId, req.serviceUser?.sub);
  }

  @Post(':boardId/invitations')
  @HttpCode(HttpStatus.CREATED)
  createBoardInvitation(
    @Param('boardId') boardId: string,
    @Body() dto: CreateBoardInvitationDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.createBoardInvitation(boardId, dto, req.serviceUser?.sub);
  }

  @Get(':boardId/invitations')
  listBoardInvitations(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.listBoardInvitations(boardId, req.serviceUser?.sub);
  }

  @Post(':boardId/invitations/:invitationId/accept')
  acceptBoardInvitation(
    @Param('boardId') boardId: string,
    @Param('invitationId') invitationId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.acceptBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
  }

  @Delete(':boardId/invitations/:invitationId')
  revokeBoardInvitation(
    @Param('boardId') boardId: string,
    @Param('invitationId') invitationId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.revokeBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
  }
}
