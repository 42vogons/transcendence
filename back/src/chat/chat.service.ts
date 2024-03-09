import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { ChatDto } from './dto/chat.dto';
import { ChannelRepository } from 'src/channel/repository/channel.repository';
import { UsersService } from 'src/users/users.service';
import { BlockUserDto } from 'src/users/dto/blockUser.dto';
import { ChannelService } from 'src/channel/channel.service';
import { AdminActionType } from 'src/channel/constants';

@Injectable()
export class ChatService {
  constructor(
    private readonly repository: ChatRepository,
    private readonly channelRepository: ChannelRepository,
    private readonly usersService: UsersService,
    private readonly channelService: ChannelService,
  ) {}

  async sendBroadCast(channel_id: number, msg: string) {
    const chatDto = new ChatDto();
    chatDto.channel_id = channel_id;
    chatDto.sender_id = 1;
    chatDto.content = msg;
    await this.repository.saveMessage(chatDto);
  }

  async saveMessage(chatDto: ChatDto): Promise<number[]> {
    const isMember = await this.channelRepository.checkMember(
      chatDto.sender_id,
      chatDto.channel_id,
    );
    if (!isMember && chatDto.sender_id != 0) {
      throw new NotFoundException('You are not a member of this channel.');
    }
    await this.repository.saveMessage(chatDto);
    const members = await this.channelRepository.listMembers(
      chatDto.channel_id,
    );
    // se for DM precisa verificar se a msg não está bloqueada para não notificar o user.
    return members.map(member => member.user_id);
  }

  async getChatMessage(channel_id: number, user_id: number): Promise<any> {
    const members = await this.channelRepository.listMembers(channel_id);
    const isMember = members.some(member => member.users.user_id === user_id);
    if (!isMember) {
      throw new NotFoundException('You are not a member of this channel.');
    }

    const channel = await this.channelRepository.findChannel(channel_id);
    if (channel.type !== 'direct') {
      const isBanned = await this.channelService.checkAction(
        user_id,
        channel_id,
        AdminActionType.BANNED,
        'status',
      );

      const isKicked = await this.channelService.checkAction(
        user_id,
        channel_id,
        AdminActionType.KICKED,
        'status',
      );
      if (isBanned != null) {
        return await this.repository.getChatMessageBefore(
          channel_id,
          isBanned.end_time,
        );
      }
      if (isKicked != null) {
        return await this.repository.getChatMessageBefore(
          channel_id,
          isKicked.end_time,
        );
      }
      return await this.repository.getChatMessage(channel_id);
    }
    const blockUserDto = new BlockUserDto();
    blockUserDto.member_id = members.find(
      member => member.user_id !== user_id,
    ).user_id;
    blockUserDto.user_id = user_id;
    const blocked = await this.usersService.checkBlockedStatus(blockUserDto);
    if (blocked) {
      return await this.repository.getChatMessageBefore(channel_id, blocked);
    }
    return await this.repository.getChatMessage(channel_id);
  }
}
