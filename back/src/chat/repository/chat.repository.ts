import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { ChatDto } from '../dto/chat.dto';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}
  async saveMessage(chatDto: ChatDto): Promise<ChatDto> {
    return await this.prisma.chat_messages.create({
      data: {
        sender_id: chatDto.sender_id,
        channel_id: chatDto.channel_id,
        content: chatDto.content,
      },
    });
  }

  async getChatMessage(channel_id: number) {
    const messages = await this.prisma.chat_messages.findMany({
      where: {
        channel_id: channel_id,
      },
      include: {
        users_chat_messages_sender_idTousers: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });

    return messages.map(message => ({
      message_id: message.message_id,
      sender_id: message.sender_id,
      channel_id: message.channel_id,
      content: message.content,
      timestamp: message.timestamp,
      username: message.users_chat_messages_sender_idTousers.username,
    }));
  }

  async getChatMessageBefore(channel_id: number, blockEntry: Date) {
    return this.prisma.chat_messages.findMany({
      where: {
        channel_id: channel_id,
        timestamp: { lt: blockEntry },
      },
      include: {
        users_chat_messages_sender_idTousers: {
          select: {
            username: true,
          },
        },
      },
      orderBy: {
        timestamp: 'asc',
      },
    });
  }
}
