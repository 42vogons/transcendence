import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRepository } from './repository/chat.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [ChatRepository, ChatService, PrismaService],
  exports: [ChatRepository, ChatService, PrismaService], // Exporte o UsersService, se necessário
})
export class ChatModule {}
