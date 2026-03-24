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
import { BoardsService } from './boards.service';
import { CreateBoardDto } from './dto/create-board.dto';
import { CreateColumnDto } from './dto/create-column.dto';
import { ReorderColumnsDto } from './dto/reorder-columns.dto';
import { RenameColumnDto } from './dto/rename-column.dto';
import { DeleteColumnDto } from './dto/delete-column.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Boards')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('boards')
@UseGuards(InternalAuthGuard)
export class BoardsController {
  constructor(private readonly boardsService: BoardsService) {}

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

  @Post(':boardId/tickets')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create ticket in board' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiBody({ type: CreateTicketDto })
  @ApiCreatedResponse({ description: 'Ticket created' })
  createTicket(
    @Param('boardId') boardId: string,
    @Body() dto: CreateTicketDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.createTicket(boardId, dto, req.serviceUser?.sub);
  }

  @Patch(':boardId/tickets/reorder')
  @ApiOperation({ summary: 'Reorder board tickets' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiBody({ type: ReorderTicketsDto })
  @ApiOkResponse({
    description: 'Tickets reordered',
    schema: { example: { ok: true } },
  })
  async reorderTickets(
    @Param('boardId') boardId: string,
    @Body() dto: ReorderTicketsDto,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.reorderTickets(boardId, dto, req.serviceUser?.sub);
    return { ok: true };
  }

  @Get(':boardId/tickets/:ticketId')
  @ApiOperation({ summary: 'Get ticket by ID' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'ticketId', description: 'Ticket ID' })
  @ApiOkResponse({ description: 'Ticket details' })
  @ApiNotFoundResponse({ description: 'Ticket not found' })
  getTicketById(
    @Param('boardId') boardId: string,
    @Param('ticketId') ticketId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.getTicketById(boardId, ticketId, req.serviceUser?.sub);
  }

  @Patch(':boardId/tickets/:ticketId')
  @ApiOperation({ summary: 'Update ticket' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'ticketId', description: 'Ticket ID' })
  @ApiBody({ type: UpdateTicketDto })
  @ApiOkResponse({ description: 'Ticket updated' })
  @ApiNotFoundResponse({ description: 'Ticket not found' })
  updateTicket(
    @Param('boardId') boardId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: UpdateTicketDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.updateTicket(boardId, ticketId, dto, req.serviceUser?.sub);
  }

  @Post(':boardId/tickets/:ticketId/comments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create ticket comment' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'ticketId', description: 'Ticket ID' })
  @ApiBody({ type: CreateTicketCommentDto })
  @ApiCreatedResponse({ description: 'Comment created' })
  createTicketComment(
    @Param('boardId') boardId: string,
    @Param('ticketId') ticketId: string,
    @Body() dto: CreateTicketCommentDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.createTicketComment(boardId, ticketId, dto, req.serviceUser?.sub);
  }

  @Delete(':boardId/tickets/:ticketId')
  @ApiOperation({ summary: 'Delete ticket' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'ticketId', description: 'Ticket ID' })
  @ApiOkResponse({
    description: 'Ticket deleted',
    schema: { example: { ok: true } },
  })
  async deleteTicket(
    @Param('boardId') boardId: string,
    @Param('ticketId') ticketId: string,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.deleteTicket(boardId, ticketId, req.serviceUser?.sub);
    return { ok: true };
  }

  @Get(':boardId/members')
  @ApiOperation({ summary: 'List board members' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiOkResponse({ description: 'Board members list' })
  listBoardMembers(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.listBoardMembers(boardId, req.serviceUser?.sub);
  }

  @Patch(':boardId/members/:memberId/custom-role')
  @ApiOperation({ summary: 'Update member custom role in board' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'memberId', description: 'Board member ID' })
  @ApiBody({ type: UpdateBoardMemberCustomRoleDto })
  @ApiOkResponse({ description: 'Member custom role updated' })
  updateBoardMemberCustomRole(
    @Param('boardId') boardId: string,
    @Param('memberId') memberId: string,
    @Body() dto: UpdateBoardMemberCustomRoleDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.updateBoardMemberCustomRole(boardId, memberId, dto, req.serviceUser?.sub);
  }

  @Delete(':boardId/members/me')
  @ApiOperation({ summary: 'Leave board as current user' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiOkResponse({
    description: 'Left board successfully',
    schema: { example: { ok: true } },
  })
  async leaveBoard(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.leaveBoard(boardId, req.serviceUser?.sub);
    return { ok: true };
  }

  @Delete(':boardId/members/:memberId')
  @ApiOperation({ summary: 'Remove board member' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'memberId', description: 'Board member ID' })
  @ApiOkResponse({
    description: 'Member removed',
    schema: { example: { ok: true } },
  })
  async removeBoardMember(
    @Param('boardId') boardId: string,
    @Param('memberId') memberId: string,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.removeBoardMember(boardId, memberId, req.serviceUser?.sub);
    return { ok: true };
  }

  @Post(':boardId/roles')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create custom role for board' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiBody({ type: CreateBoardRoleDto })
  @ApiCreatedResponse({ description: 'Role created' })
  createBoardRole(
    @Param('boardId') boardId: string,
    @Body() dto: CreateBoardRoleDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.createBoardRole(boardId, dto, req.serviceUser?.sub);
  }

  @Get(':boardId/roles')
  @ApiOperation({ summary: 'List board custom roles' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiOkResponse({ description: 'Board roles list' })
  listBoardRoles(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.listBoardRoles(boardId, req.serviceUser?.sub);
  }

  @Patch(':boardId/roles/:roleId')
  @ApiOperation({ summary: 'Update board custom role' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiBody({ type: UpdateBoardRoleDto })
  @ApiOkResponse({ description: 'Role updated' })
  updateBoardRole(
    @Param('boardId') boardId: string,
    @Param('roleId') roleId: string,
    @Body() dto: UpdateBoardRoleDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.updateBoardRole(boardId, roleId, dto, req.serviceUser?.sub);
  }

  @Delete(':boardId/roles/:roleId')
  @ApiOperation({ summary: 'Delete board custom role' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'roleId', description: 'Role ID' })
  @ApiOkResponse({
    description: 'Role deleted',
    schema: { example: { ok: true } },
  })
  async deleteBoardRole(
    @Param('boardId') boardId: string,
    @Param('roleId') roleId: string,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.deleteBoardRole(boardId, roleId, req.serviceUser?.sub);
    return { ok: true };
  }

  @Post(':boardId/invitations')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create board invitation' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiBody({ type: CreateBoardInvitationDto })
  @ApiCreatedResponse({ description: 'Invitation created' })
  createBoardInvitation(
    @Param('boardId') boardId: string,
    @Body() dto: CreateBoardInvitationDto,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.createBoardInvitation(boardId, dto, req.serviceUser?.sub);
  }

  @Get(':boardId/invitations')
  @ApiOperation({ summary: 'List board invitations' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiOkResponse({ description: 'Invitations list' })
  listBoardInvitations(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.listBoardInvitations(boardId, req.serviceUser?.sub);
  }

  @Post(':boardId/invitations/:invitationId/accept')
  @ApiOperation({ summary: 'Accept board invitation by invitation ID' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'invitationId', description: 'Invitation ID' })
  @ApiOkResponse({
    description: 'Invitation accepted',
    schema: { example: { success: true, boardId: 'board_1' } },
  })
  acceptBoardInvitation(
    @Param('boardId') boardId: string,
    @Param('invitationId') invitationId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardsService.acceptBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
  }

  @Delete(':boardId/invitations/:invitationId')
  @ApiOperation({ summary: 'Revoke board invitation' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiParam({ name: 'invitationId', description: 'Invitation ID' })
  @ApiOkResponse({
    description: 'Invitation revoked',
    schema: { example: { ok: true } },
  })
  async revokeBoardInvitation(
    @Param('boardId') boardId: string,
    @Param('invitationId') invitationId: string,
    @Req() req: AuthRequest,
  ) {
    await this.boardsService.revokeBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
    return { ok: true };
  }
}
