import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Req,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BoardInvitationsService } from './board-invitations.service';
import { CreateBoardInvitationDto } from './dto/create-board-invitation.dto';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Boards / Invitations')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('boards/:boardId/invitations')
@UseGuards(InternalAuthGuard)
export class BoardInvitationsController {
  constructor(private readonly boardInvitationsService: BoardInvitationsService) {}

  @Post()
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
    return this.boardInvitationsService.createBoardInvitation(boardId, dto, req.serviceUser?.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List board invitations' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiOkResponse({ description: 'Invitations list' })
  listBoardInvitations(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardInvitationsService.listBoardInvitations(boardId, req.serviceUser?.sub);
  }

  @Post(':invitationId/accept')
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
    return this.boardInvitationsService.acceptBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
  }

  @Delete(':invitationId')
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
    await this.boardInvitationsService.revokeBoardInvitation(boardId, invitationId, req.serviceUser?.sub);
    return { ok: true };
  }
}
