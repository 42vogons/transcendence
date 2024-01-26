import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtService } from '@nestjs/jwt';
import { ChatRepository } from './repository/chat.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ChatController],
  providers: [ChatService, JwtService, ChatRepository, PrismaService],
  exports: [ChatService, PrismaService, ChatRepository], // Exporte o UsersService, se necessário
})
export class ChatModule {}
