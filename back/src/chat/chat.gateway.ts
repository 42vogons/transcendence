import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatDto } from './dto/chat.dto';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(private readonly prisma: PrismaService) {}

  @SubscribeMessage('msgToServer')
  async handleMessage(client: Socket, payload: ChatDto): Promise<void> {
    try {
      const newMessage = await this.prisma.chat_messages.create({
        data: {
          sender_id: payload.sender_id,
          receiver_id: payload.receiver_id,
          channel_id: payload.channel_id,
          content: payload.content,
        },
      });
      this.logger.log(`Received ${JSON.stringify(payload)}`);
      this.server.emit('msgToClient', newMessage, client.id);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  }

  afterInit(server: Server) {
    this.logger.log(`Init: ${server}`);
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      const messages = await this.prisma.chat_messages.findMany({
        orderBy: {
          timestamp: 'asc',
        },
      });
      client.emit('initialMessages', messages);
    } catch (error) {
      console.error('Error retrieving initial messages:', error);
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
