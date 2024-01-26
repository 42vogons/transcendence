import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChatRepository } from './repository/chat.repository';
import { CreateChatDto } from './dto/create-chat.dto copy';

@Injectable()
export class ChatService {
  constructor(
    private readonly repository: ChatRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createChatDto: CreateChatDto, token: any) {
    const decodeToken = this.jwtService.decode(token);
    const userId = decodeToken.id;
    const channel = await this.repository.createChat(createChatDto, token);
    this.addMember(userId, channel.channel_id, 'Admin', userId);
    this.addMember(createChatDto.user_id, channel.channel_id, 'Member', token);
    return 'Canal criado' + userId;
  }

  async addMember(
    member_id: number,
    channel_id: number,
    status: string,
    token: any,
  ) {
    const decodeToken = this.jwtService.decode(token);
    const userId = decodeToken.id;
    const isAdmin = await this.repository.checkUser(channel_id, userId);
    const isOwner = await this.repository.checkOwner(channel_id, userId);
    if (isAdmin || isOwner) {
      this.repository.addUserToChannel(member_id, channel_id, status);
    } else {
      console.log('Você não é admin ou owner');
      // manda msg de erro informando que não é admin
    }
  }
}
