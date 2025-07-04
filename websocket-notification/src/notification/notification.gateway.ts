import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Cron, CronExpression } from '@nestjs/schedule';

@WebSocketGateway({ cors: true })
export class NotificationGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  @Cron(CronExpression.EVERY_10_SECONDS) // ⏱ Change to EVERY_MINUTE or others if you want
  handleScheduledNotification() {
    const message = `⏰ Scheduled Message at ${new Date().toLocaleTimeString()}`;
    this.sendNotification(message); // Reuse your existing method
    console.log('Sent scheduled notification:', message);
  }

  // Store connected users: username => socket.id
  private clients = new Map<string, string>();
  private notifications: { message: string; time: string; to?: string }[] = [];
  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    // Remove disconnected client from map
    for (const [username, socketId] of this.clients.entries()) {
      if (socketId === client.id) {
        this.clients.delete(username);
        break;
      }
    }
  }

  // Client sends username after connecting
  @SubscribeMessage('register')
  handleRegister(
    @MessageBody() data: { username: string },
    @ConnectedSocket() client: Socket,
  ) {
    console.log(`Registered ${data.username} => ${client.id}`);
    this.clients.set(data.username, client.id);
  }

  sendNotification(message: string) {
    const entry = {
      message,
      time: new Date().toISOString(),
      to: 'all',
    };
    this.notifications.push(entry);
    this.server.emit('notification', { message });
  }

  sendToUser(username: string, message: string) {
    const socketId = this.clients.get(username);
    const entry = {
      message,
      time: new Date().toISOString(),
      to: username,
    };
    this.notifications.push(entry);
    if (socketId) {
      this.server.to(socketId).emit('notification', { message });
    } else {
      console.log(`User ${username} not connected`);
    }
  }

  // Utility (next step): Get total connected users
  getClientCount(): number {
    return this.clients.size;
  }
  getNotificationHistory() {
    return this.notifications;
  }
}
