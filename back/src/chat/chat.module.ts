import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRepository } from './repository/chat.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChannelRepository } from 'src/channel/repository/channel.repository';
import { UsersService } from 'src/users/users.service';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { JwtService } from '@nestjs/jwt';
import { ChannelService } from 'src/channel/channel.service';

@Module({
  providers: [
    ChatRepository,
    ChatService,
    PrismaService,
    ChannelRepository,
    UsersService,
    UsersRepository,
    ChannelService,
    JwtService,
  ],
  exports: [
    ChatRepository,
    ChatService,
    PrismaService,
    ChannelRepository,
    UsersService,
    UsersRepository,
    ChannelService,
    JwtService,
  ],
})
export class ChatModule {}
