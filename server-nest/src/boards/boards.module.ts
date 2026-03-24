import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { InvitationsPublicController } from './invitations.public.controller';
import { NotificationsController } from './notifications.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [BoardsController, InvitationsPublicController, NotificationsController],
  providers: [BoardsService],
})
export class BoardsModule {}
