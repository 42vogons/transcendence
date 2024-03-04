import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { JwtService } from '@nestjs/jwt';
import { ChannelRepository } from './repository/channel.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from 'src/users/repositories/users.repository';
import { ChatRepository } from 'src/chat/repository/chat.repository';

@Module({
  controllers: [ChannelController],
  providers: [
    ChannelService,
    JwtService,
    ChannelRepository,
    PrismaService,
    UsersRepository,
    ChatRepository,
  ],
  exports: [ChannelService, PrismaService, ChannelRepository, UsersRepository],
})
export class ChannelModule {}
