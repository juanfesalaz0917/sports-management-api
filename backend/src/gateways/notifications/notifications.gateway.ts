import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(NotificationsGateway.name);

  @WebSocketServer()
  server?: Server;

  handleConnection(client: Socket): void {
    this.logger.log(`Cliente WebSocket conectado: ${client.id}`);
    client.emit('bienvenida', { status: 'conectado', timestamp: new Date() });
  }

  handleDisconnect(client: Socket): void {
    this.logger.log(`Cliente WebSocket desconectado: ${client.id}`);
  }

  @SubscribeMessage('ping')
  handlePing(@MessageBody() _data: unknown): string {
    return 'pong';
  }

  broadcast(evento: string, data: unknown): void {
    this.server?.emit(evento, data);
  }
}
