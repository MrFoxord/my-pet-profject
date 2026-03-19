import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  Req,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Request } from 'express';
import { BoardsService } from './boards.service';

@Controller('invitations')
export class InvitationsPublicController {
  constructor(private readonly boardsService: BoardsService) {}

  @Get(':token')
  async getInvitationByToken(@Param('token') token: string) {
    return this.boardsService.getInvitationByToken(token);
  }

  @Post(':token/accept')
  async acceptInvitationByToken(
    @Param('token') token: string,
    @Body() body: { userId?: string; email?: string; password?: string },
  ) {
    // This endpoint can be called:
    // 1. By authenticated user (with userId in JWT) → auto-accept if email matches
    // 2. By registering user → accept and create user in one step
    // For now, we'll support authenticated users
    return this.boardsService.acceptInvitationByToken(token, body.userId);
  }
}
