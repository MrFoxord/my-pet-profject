import {
  Body,
  Controller,
  Get,
  Patch,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';
import { UpdateDefaultProfileDto } from './dto/update-default-profile.dto';
import { UsersService } from './users.service';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Users')
@ApiBearerAuth('bearer')
@Controller('users')
@UseGuards(InternalAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/default-state')
  @ApiOperation({ summary: 'Get current user default profile state' })
  @ApiOkResponse({
    description: 'Current default profile state',
    schema: {
      example: {
        isDefault: false,
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'johnny',
        workRole: 'CLIENT',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async getDefaultState(@Req() req: AuthRequest) {
    const userId = req.serviceUser?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.usersService.getDefaultState(userId);
  }

  @Patch('me/default-profile')
  @ApiOperation({ summary: 'Update current user default profile' })
  @ApiBody({ type: UpdateDefaultProfileDto })
  @ApiOkResponse({
    description: 'Updated default profile',
    schema: {
      example: {
        isDefault: true,
        firstName: 'John',
        lastName: 'Doe',
        nickname: 'johnny',
        workRole: 'EXECUTOR',
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  async updateDefaultProfile(
    @Req() req: AuthRequest,
    @Body() dto: UpdateDefaultProfileDto,
  ) {
    const userId = req.serviceUser?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.usersService.updateDefaultProfile(userId, dto);
  }
}
