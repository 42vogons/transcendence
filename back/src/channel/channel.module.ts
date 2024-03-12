import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { JwtService } from '@nestjs/jwt';
import { ChannelRepository } from './repository/channel.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatRepository } from 'src/chat/repository/chat.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [ChannelController],
  providers: [
    ChannelService,
    JwtService,
    ChannelRepository,
    PrismaService,
    //UsersRepository,
    ChatRepository,
  ],
  exports: [ChannelService, PrismaService, ChannelRepository],
})
export class ChannelModule {}
