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
import { BoardRolesService } from './board-roles.service';
import { CreateBoardRoleDto } from './dto/create-board-role.dto';
import { UpdateBoardRoleDto } from './dto/update-board-role.dto';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Boards / Roles')
@ApiBearerAuth('bearer')
@ApiUnauthorizedResponse({ description: 'Unauthorized' })
@ApiForbiddenResponse({ description: 'Forbidden' })
@Controller('boards/:boardId/roles')
@UseGuards(InternalAuthGuard)
export class BoardRolesController {
  constructor(private readonly boardRolesService: BoardRolesService) {}

  @Post()
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
    return this.boardRolesService.createBoardRole(boardId, dto, req.serviceUser?.sub);
  }

  @Get()
  @ApiOperation({ summary: 'List board custom roles' })
  @ApiParam({ name: 'boardId', description: 'Board ID' })
  @ApiOkResponse({ description: 'Board roles list' })
  listBoardRoles(
    @Param('boardId') boardId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardRolesService.listBoardRoles(boardId, req.serviceUser?.sub);
  }

  @Patch(':roleId')
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
    return this.boardRolesService.updateBoardRole(boardId, roleId, dto, req.serviceUser?.sub);
  }

  @Delete(':roleId')
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
    await this.boardRolesService.deleteBoardRole(boardId, roleId, req.serviceUser?.sub);
    return { ok: true };
  }
}
