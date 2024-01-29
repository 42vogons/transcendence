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
import { UsersService } from 'src/users/users.service';
import { ChatDto } from './dto/chat.dto';
import * as cookie from 'cookie';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
  ) {}

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
    const cookies = cookie.parse(client.handshake.headers.cookie || '');
    this.logger.log(`cookies: ${JSON.stringify(cookies)}`);
    if (cookies.accessToken) {
      const token = cookies.accessToken;
      this.logger.log(`accessToken: ${token}`);
      const user = await this.usersService.findByToken(token);
      this.logger.log(`user: $${JSON.stringify(user)}`);
      try {
        const messages = await this.prisma.chat_messages.findMany({
          where: { sender_id: user.user_id },
          orderBy: { timestamp: 'asc' },
        });
        client.emit('initialMessages', messages);
      } catch (error) {
        console.error('Error retrieving initial messages:', error);
      }
    } else {
      this.logger.log('accessToken not found in cookies');
    }
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }
}
