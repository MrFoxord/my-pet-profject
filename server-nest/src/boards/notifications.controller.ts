import {
  Controller,
  Get,
  Patch,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { InternalAuthGuard, ServiceJwtPayload } from '../auth/internal-auth.guard';
import { BoardNotificationsService } from './board-notifications.service';

type AuthRequest = Request & { serviceUser?: ServiceJwtPayload };

@ApiTags('Notifications')
@ApiBearerAuth('bearer')
@Controller('notifications')
@UseGuards(InternalAuthGuard)
export class NotificationsController {
  constructor(private readonly boardNotificationsService: BoardNotificationsService) {}

  @Get()
  @ApiOperation({ summary: 'List user notifications' })
  @ApiOkResponse({
    description: 'Notifications list with unread count',
    schema: {
      example: {
        unreadCount: 2,
        items: [
          {
            id: 'notif_1',
            kind: 'ticket',
            boardId: 'board_1',
            ticketId: 'ticket_1',
            title: 'Ticket updated',
            message: 'Priority changed to high',
            isRead: false,
            createdAt: '2026-03-24T12:00:00.000Z',
          },
        ],
      },
    },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  list(@Req() req: AuthRequest) {
    return this.boardNotificationsService.listUserNotifications(req.serviceUser?.sub);
  }

  @Patch('read-all')
  @ApiOperation({ summary: 'Mark all user notifications as read' })
  @ApiOkResponse({
    description: 'Read status updated',
    schema: { example: { ok: true, unreadCount: 0 } },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  markAllAsRead(@Req() req: AuthRequest) {
    return this.boardNotificationsService.markAllNotificationsRead(req.serviceUser?.sub);
  }

  @Patch(':notificationId/read')
  @ApiOperation({ summary: 'Mark one notification as read' })
  @ApiParam({ name: 'notificationId', description: 'Notification ID' })
  @ApiOkResponse({
    description: 'Read status updated',
    schema: { example: { ok: true, unreadCount: 1 } },
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  markAsRead(
    @Param('notificationId') notificationId: string,
    @Req() req: AuthRequest,
  ) {
    return this.boardNotificationsService.markNotificationRead(notificationId, req.serviceUser?.sub);
  }
}