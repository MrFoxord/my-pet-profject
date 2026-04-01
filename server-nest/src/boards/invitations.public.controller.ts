import {
  Controller,
  Get,
  Post,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBearerAuth,
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { BoardInvitationsService } from './board-invitations.service';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Invitations (Public)')
@Controller('invitations')
export class InvitationsPublicController {
  constructor(private readonly boardInvitationsService: BoardInvitationsService) {}

  @Get(':token')
  @Throttle({ default: { limit: 30, ttl: 60_000 } })
  @ApiOperation({ summary: 'Get invitation details by token' })
  @ApiParam({ name: 'token', description: 'Invitation token' })
  @ApiOkResponse({
    description: 'Invitation details',
    schema: {
      example: {
        id: 'inv_1',
        token: 'abc123',
        type: 'PERSONAL',
        email: 'user@example.com',
        state: 'pending',
        maxUses: 1,
        usedCount: 0,
        expiresAt: '2026-03-30T12:00:00.000Z',
        board: { id: 'board_1', title: 'Product board', logoUrl: null },
      },
    },
  })
  @ApiNotFoundResponse({ description: 'Invitation not found' })
  async getInvitationByToken(@Param('token') token: string) {
    return this.boardInvitationsService.getInvitationByToken(token);
  }

  @Post(':token/accept')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @UseGuards(InternalAuthGuard)
  @ApiBearerAuth('bearer')
  @ApiOperation({ summary: 'Accept invitation by token' })
  @ApiParam({ name: 'token', description: 'Invitation token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {},
      example: {},
    },
  })
  @ApiOkResponse({
    description: 'Invitation accepted',
    schema: { example: { success: true, boardId: 'board_1' } },
  })
  @ApiUnauthorizedResponse({ description: 'Authentication is required to accept invitation' })
  async acceptInvitationByToken(
    @Param('token') token: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardInvitationsService.acceptInvitationByToken(token, req.serviceUser?.sub);
  }
}
