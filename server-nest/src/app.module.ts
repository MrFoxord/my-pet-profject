import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { PrismaModule } from './prisma/prisma.module';
import { BoardsModule } from './boards/boards.module';
import { HealthController } from './health.controller';
import { UsersModule } from './users/users.module';
import { RealtimeModule } from './realtime/realtime.module';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: Number(process.env.RATE_LIMIT_TTL_MS ?? 60_000),
          limit: Number(process.env.RATE_LIMIT_MAX_REQUESTS ?? 120),
        },
      ],
    }),
    PrismaModule,
    BoardsModule,
    UsersModule,
    RealtimeModule,
  ],
  controllers: [HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
