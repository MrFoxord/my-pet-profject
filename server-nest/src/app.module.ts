import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { BoardsModule } from './boards/boards.module';
import { HealthController } from './health.controller';

@Module({
  imports: [PrismaModule, BoardsModule],
  controllers: [HealthController],
})
export class AppModule {}
