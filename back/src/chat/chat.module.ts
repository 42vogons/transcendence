import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRepository } from './repository/chat.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelRepository } from 'src/channel/repository/channel.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  providers: [
    ChatRepository,
    ChatService,
    PrismaService,
    ChannelRepository,
    UsersService,
    UsersRepository,
    JwtService,
  ],
  exports: [
    ChatRepository,
    ChatService,
    PrismaService,
    ChannelRepository,
    UsersService,
    UsersRepository,
    JwtService,
  ], // Exporte o UsersService, se necessário
})
export class ChatModule {}
