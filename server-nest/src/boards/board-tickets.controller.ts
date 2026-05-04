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
import { CreateTicketDto } from './dto/create-ticket.dto';
import { CreateTicketCommentDto } from './dto/create-ticket-comment.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { ReorderTicketsDto } from './dto/reorder-tickets.dto';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Boards / Tickets')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('boards/:boardId/tickets')
@UseGuards(InternalAuthGuard)
export class BoardTicketsController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
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

  @Patch('reorder')
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

  @Get(':ticketId')
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

  @Patch(':ticketId')
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

  @Post(':ticketId/comments')
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

  @Delete(':ticketId')
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
}
