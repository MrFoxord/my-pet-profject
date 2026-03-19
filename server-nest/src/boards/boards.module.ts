import { Module } from '@nestjs/common';
import { BoardsController } from './boards.controller';
import { InvitationsPublicController } from './invitations.public.controller';
import { BoardsService } from './boards.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BoardsController, InvitationsPublicController],
  providers: [BoardsService],
})
export class BoardsModule {}
