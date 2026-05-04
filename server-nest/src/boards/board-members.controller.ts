import {
  Controller,
  Get,
  Patch,
  Delete,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { BoardMembersService } from './board-members.service';
import { UpdateBoardMemberCustomRoleDto } from './dto/update-board-member-custom-role.dto';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Boards / Members')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('boards/:boardId/members')
@UseGuards(InternalAuthGuard)
export class BoardMembersController {
  constructor(private readonly boardMembersService: BoardMembersService) {}

  @Get()
  @ApiOperation({ summary: 'List board members' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiOkResponse({ description: 'Board members list' })
  listBoardMembers(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardMembersService.listBoardMembers(boardId, req.serviceUser?.sub);
  }

  @Patch(':memberId/custom-role')
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
    return this.boardMembersService.updateBoardMemberCustomRole(boardId, memberId, dto, req.serviceUser?.sub);
  }

  @Delete('me')
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
    await this.boardMembersService.leaveBoard(boardId, req.serviceUser?.sub);
    return { ok: true };
  }

  @Delete(':memberId')
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
    await this.boardMembersService.removeBoardMember(boardId, memberId, req.serviceUser?.sub);
    return { ok: true };
  }
}
