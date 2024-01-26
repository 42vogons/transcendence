import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { channels } from '@prisma/client';
import { CreateChatDto } from '../dto/create-chat.dto copy';

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createChat(
    creatChat: CreateChatDto,
    owner_id: number,
  ): Promise<channels> {
    return this.prisma.channels.create({
      data: {
        name: creatChat.name,
        type: creatChat.type,
        password: creatChat.password,
        owner_id: owner_id,
      },
    });
  }

  async checkOwner(channel_id: number, user_id: number): Promise<boolean> {
    const channelOwner = await this.prisma.channels.findUnique({
      where: {
        channel_id: channel_id,
      },
      select: {
        owner_id: true,
      },
    });
    console.log('userr' + user_id);
    console.log('owner_id' + channelOwner.owner_id);
    return channelOwner ? channelOwner.owner_id === user_id : false;
  }

  async checkUser(channel_id: number, user_id: number): Promise<boolean> {
    const channelMember = await this.prisma.channel_members.findUnique({
      where: {
        channel_id_user_id: {
          channel_id: channel_id,
          user_id: user_id,
        },
      },
      select: {
        status: true,
      },
    });
    return channelMember ? channelMember.status === 'admin' : false;
  }

  async addUserToChannel(
    member_id: number,
    channel_id: number,
    status: string,
  ): Promise<void> {
    await this.prisma.channel_members.create({
      data: {
        user_id: member_id,
        channel_id: channel_id,
        status: status,
      },
    });
  }
}
