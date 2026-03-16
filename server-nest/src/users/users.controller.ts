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
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';
import { UpdateDefaultProfileDto } from './dto/update-default-profile.dto';
import { UsersService } from './users.service';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@Controller('users')
@UseGuards(InternalAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me/default-state')
  async getDefaultState(@Req() req: AuthRequest) {
    const userId = req.serviceUser?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.usersService.getDefaultState(userId);
  }

  @Patch('me/default-profile')
  async updateDefaultProfile(
    @Req() req: AuthRequest,
    @Body() dto: UpdateDefaultProfileDto,
  ) {
    const userId = req.serviceUser?.sub;
    if (!userId) throw new UnauthorizedException();
    return this.usersService.updateDefaultProfile(userId, dto);
  }
}
