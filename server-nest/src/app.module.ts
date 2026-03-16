import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BoardsModule } from './boards/boards.module';
import { HealthController } from './health.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [PrismaModule, BoardsModule, UsersModule],
  controllers: [HealthController],
})
export class AppModule {}
