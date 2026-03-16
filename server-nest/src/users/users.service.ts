import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateDefaultProfileDto } from './dto/update-default-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getDefaultState(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        nickname: true,
        workRole: true,
        isDefault: true,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    return user;
  }

  async updateDefaultProfile(userId: string, dto: UpdateDefaultProfileDto) {
    const firstName = dto.firstName.trim();
    const lastName = dto.lastName.trim();
    const nickname = dto.nickname?.trim() || null;

    if (!firstName || !lastName) {
      throw new BadRequestException('firstName and lastName are required');
    }

    try {
      const updated = await this.prisma.user.update({
        where: { id: userId },
        data: {
          firstName,
          lastName,
          name: `${firstName} ${lastName}`,
          nickname,
          workRole: dto.workRole,
          isDefault: false,
        },
        select: {
          id: true,
          name: true,
          firstName: true,
          lastName: true,
          nickname: true,
          workRole: true,
          isDefault: true,
        },
      });

      return updated;
    } catch (error: unknown) {
      if (
        typeof error === 'object' &&
        error !== null &&
        'code' in error &&
        (error as { code?: string }).code === 'P2002'
      ) {
        throw new BadRequestException('nickname already exists');
      }

      throw error;
    }
  }
}
