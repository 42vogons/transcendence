import { Injectable, NotFoundException } from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { ChatDto } from './dto/chat.dto';
import { ChannelRepository } from 'src/channel/repository/channel.repository';
import { UsersService } from 'src/users/users.service';
import { BlockUserDto } from 'src/users/dto/blockUser.dto';

@Injectable()
export class ChatService {
  constructor(
    private readonly repository: ChatRepository,
    private readonly channelRepository: ChannelRepository,
    private readonly usersService: UsersService,
  ) {}

  async saveMessage(chatDto: ChatDto): Promise<ChatDto> {
    const isMember = await this.channelRepository.checkMember(
      chatDto.sender_id,
      chatDto.channel_id,
    );
    if (!isMember) {
      throw new NotFoundException('Você não é membro deste canal');
      //lançar uma excpetion que nao é membro do canal
    }
    // primeiro verifica se o user pode mandar msg no canal
    
    return await this.repository.saveMessage(chatDto);
    // vai me devolver uma lista com os usuários desse canal
    // caso o tipo de chat seja DM, ira devolver o usuário caso não esteja bloqueado
  }

  async getChatMessage(channel_id: number, user_id: number): Promise<any> {
    const members = await this.channelRepository.listMembers(channel_id);
    const isMember = members.some(member => member.users.user_id === user_id);
    if (!isMember) {
      throw new NotFoundException('Você não é membro deste canal');
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
