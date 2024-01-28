import { PrismaService } from 'src/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { channels } from '@prisma/client';
import { CreateChannelDto } from '../dto/create-channel.dto';

@Injectable()
export class ChannelRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createChannel(
    creatChannel: CreateChannelDto,
    owner_id: number,
  ): Promise<channels> {
    return this.prisma.channels.create({
      data: {
        name: creatChannel.name,
        type: creatChannel.type,
        password: creatChannel.password,
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

  async removeMemberChannel(member_id: number, channel_id: number) {
    await this.prisma.channel_members.delete({
      where: {
        channel_id_user_id: {
          channel_id: channel_id,
          user_id: member_id,
        },
      },
    });
  }

  async changeMemberStatus(
    member_id: number,
    channel_id: number,
    status: string,
  ) {
    await this.prisma.channel_members.update({
      where: {
        channel_id_user_id: {
          channel_id: channel_id,
          user_id: member_id,
        },
      },
      data: {
        status: status,
      },
    });
  }

  async listChannelsByUser(user_id: number) {
    return this.prisma.channel_members.findMany({
      where: {
        user_id: user_id,
      },
      include: {
        channels: true,
      },
    });
  }

  async leaveChannel(user_id: number, channel_id: number) {
    return this.prisma.channel_members.delete({
      where: {
        channel_id_user_id: {
          channel_id: channel_id,
          user_id: user_id,
        },
      },
    });
  }

  async changeOwner(new_ownder: number, channel_id: number) {
    return this.prisma.channels.update({
      where: {
        channel_id: channel_id,
      },
      data: {
        owner_id: new_ownder,
      },
    });
  }

  async checkAdmins(user_id: number, channel_id: number) {
    return await this.prisma.channel_members.findMany({
      where: {
        channel_id: channel_id,
        status: 'admin',
        user_id: {
          not: user_id,
        },
      },
    });
  }

  async findAllChannels() {
    return this.prisma.channels.findMany({
      select: {
        channel_id: true,
        name: true,
        type: true,
      },
    });
  }

  async findChannel(channel_id: number) {
    return this.prisma.channels.findUnique({
      where: {
        channel_id: channel_id,
      },
    });
  }

  async changePassword(channel_id: number, password: string) {
    return this.prisma.channels.update({
      where: {
        channel_id: channel_id,
      },
      data: {
        password: password,
      },
    });
  }

  async checkMember(user_id: number, channel_id: number){
    return await this.prisma.channel_members.findUnique({
      where: {
        channel_id_user_id: {
          channel_id: channel_id,
          user_id: user_id,
        },
      },
    });
  }
}
