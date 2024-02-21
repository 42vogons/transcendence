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
    return this.prisma.chat_messages.findMany({
      where: {
        channel_id: channel_id,
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }

  async getChatMessageBefore(channel_id: number, blockEntry: Date) {
    return this.prisma.chat_messages.findMany({
      where: {
        channel_id: channel_id,
        timestamp: { lt: blockEntry },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });
  }
}
