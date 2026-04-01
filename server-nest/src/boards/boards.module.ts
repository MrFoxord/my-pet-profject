import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { InvitationsPublicController } from './invitations.public.controller';
import { NotificationsController } from './notifications.controller';
import { BoardsService } from './board-workflow.service';
import { BoardsAccessService } from './boards-access.service';
import { BoardNotificationsService } from './board-notifications.service';
import { BoardStructureService } from './board-structure.service';
import { BoardTicketsService } from './board-tickets.service';
import { BoardInvitationsService } from './board-invitations.service';
import { BoardMembersService } from './board-members.service';
import { BoardRolesService } from './board-roles.service';
import { AuthModule } from '../auth/auth.module';
import { RealtimeModule } from '../realtime/realtime.module';

@Module({
  imports: [AuthModule, RealtimeModule],
  controllers: [BoardsController, InvitationsPublicController, NotificationsController],
  providers: [
    BoardsService,
    BoardsAccessService,
    BoardNotificationsService,
    BoardStructureService,
    BoardTicketsService,
    BoardInvitationsService,
    BoardMembersService,
    BoardRolesService,
  ],
})
export class BoardsModule {}
