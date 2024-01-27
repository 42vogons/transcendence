import { Module } from '@nestjs/common';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { JwtService } from '@nestjs/jwt';
import { ChannelRepository } from './repository/channel.repository';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  controllers: [ChannelController],
  providers: [ChannelService, JwtService, ChannelRepository, PrismaService],
  exports: [ChannelService, PrismaService, ChannelRepository], // Exporte o UsersService, se necessário
})
export class ChatModule {}
