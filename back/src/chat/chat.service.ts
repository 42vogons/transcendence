import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { ChatDto } from './dto/chat.dto';
import { ChannelRepository } from 'src/channel/repository/channel.repository';
import { UsersService } from 'src/users/users.service';
import { BlockUserDto } from 'src/users/dto/blockUser.dto';
import { ChannelService } from 'src/channel/channel.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly repository: ChatRepository,
    private readonly channelRepository: ChannelRepository,
    private readonly usersService: UsersService,
    private readonly channelService: ChannelService,
  ) {}

  async saveMessage(chatDto: ChatDto): Promise<number[]> {
    const isMember = await this.channelRepository.checkMember(
      chatDto.sender_id,
      chatDto.channel_id,
    );
    if (!isMember) {
      throw new NotFoundException('You are not a member of this channel.');
    }
    await this.channelService.checkAdminActions(
      chatDto.sender_id,
      chatDto.channel_id,
    );
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
