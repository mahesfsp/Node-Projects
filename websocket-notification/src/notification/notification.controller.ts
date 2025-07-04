import { Controller, Post, Body,Get } from '@nestjs/common';
import { NotificationGateway } from './notification.gateway';

@Controller('notification')
export class NotificationController {
  constructor(private notificationGateway: NotificationGateway) {}

  @Post()
  sendDefaultNotification(@Body('message') message: string) {
    this.notificationGateway.sendNotification(message);
    return { success: true, message: 'Notification sent!' };
  }

  @Post('all')
  sendToAll(@Body('message') message: string) {
    this.notificationGateway.sendNotification(message);
    return { success: true, message: 'Sent to all' };
  }

  @Post('user')
  sendToUser(
    @Body('username') username: string,
    @Body('message') message: string,
  ) {
    this.notificationGateway.sendToUser(username, message);
    return { success: true, message: `Sent to ${username}` };
  }

  @Get('clients')
getClientCount() {
  const count = this.notificationGateway.getClientCount();
  return { count };
}

@Get('history')
getNotificationHistory() {
  return this.notificationGateway.getNotificationHistory();
}
}
