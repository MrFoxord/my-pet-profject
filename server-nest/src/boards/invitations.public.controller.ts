import {
  Controller,
  Get,
  Post,
  Param,
  Body,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import {
  ApiBody,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { BoardsService } from './boards.service';

@ApiTags('Invitations (Public)')
@Controller('invitations')
export class InvitationsPublicController {
  constructor(private readonly boardsService: BoardsService) {}

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
    return this.boardsService.getInvitationByToken(token);
  }

  @Post(':token/accept')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiOperation({ summary: 'Accept invitation by token' })
  @ApiParam({ name: 'token', description: 'Invitation token' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        userId: { type: 'string', nullable: true },
      },
      example: { userId: 'user_123' },
    },
  })
  @ApiOkResponse({
    description: 'Invitation accepted',
    schema: { example: { success: true, boardId: 'board_1' } },
  })
  async acceptInvitationByToken(
    @Param('token') token: string,
    @Body() body: { userId?: string },
  ) {
    return this.boardsService.acceptInvitationByToken(token, body.userId);
  }
}
