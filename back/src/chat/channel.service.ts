import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChannelRepository } from './repository/channel.repository';
import { CreateChannelDto } from './dto/create-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly repository: ChannelRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createChatDto: CreateChannelDto, token: any) {
    const decodeToken = this.jwtService.decode(token);
    const userId = decodeToken.id;
    const channel = await this.repository.createChannel(createChatDto, token);
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
      throw new UnauthorizedException('Você não é admin ou owner');
    }
  }

  async removeMember(member_id: number, channel_id: number, token: any) {
    const decodeToken = this.jwtService.decode(token);
    const userId = decodeToken.id;
    const isAdmin = await this.repository.checkUser(channel_id, userId);
    const isOwner = await this.repository.checkOwner(channel_id, userId);
    const memberIsOwner = await this.repository.checkOwner(
      channel_id,
      member_id,
    );
    if ((isAdmin || isOwner) && memberIsOwner == false) {
      this.repository.removeMemberChannel(member_id, channel_id);
    } else {
      throw new UnauthorizedException(
        'Você não é admin ou owner, ou não pode excluir o owner',
      );
    }
  }

  async changeMemberStatus(
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
      this.repository.changeMemberStatus(member_id, channel_id, status);
    } else {
      throw new UnauthorizedException('Você não é admin ou owner');
    }
  }

  async listChannelsByUser(token: any) {
    const decodeToken = this.jwtService.decode(token);
    const userId = decodeToken.id;
    return this.repository.listChannelsByUser(userId);
  }

  async leaveChannel(channel_id: number, token: any) {
    const decodeToken = this.jwtService.decode(token);
    const userId = decodeToken.id;
    const admins = this.repository.checkAdmins(userId, channel_id);
    if ((await admins).length === 0) {
      throw new ConflictException(
        'Não é possível sair do canal sem outros administradores.',
      );
    }
    const owner = await this.repository.checkOwner(channel_id, userId);
    if (owner === true) {
      this.repository.changeOwner(admins[0].user_id, channel_id);
    }
    return this.repository.leaveChannel(userId, channel_id);
  }

  async listAllChannels() {
    return await this.repository.findAllChannels();
  }

  async enterChannel(channel_id: number, password: string, token: any) {
    const channel = await this.repository.findChannel(channel_id);
    const decodeToken = this.jwtService.decode(token);
    const userId = decodeToken.id;
    if (channel.password === password || channel.type === 'Public') {
      return await this.repository.addUserToChannel(
        userId,
        channel_id,
        'Member',
      );
    } else {
      throw new UnauthorizedException('Não é possível entrar no canal.');
    }
  }

  async changePassword(channel_id: number, password: string, token: any) {
    const decodeToken = this.jwtService.decode(token);
    const userId = decodeToken.id;
    const isOwner = await this.repository.checkOwner(channel_id, userId);
    if (isOwner) {
      this.repository.changePassword(channel_id, password);
    } else {
      throw new UnauthorizedException('Você não é admin ou owner');
    }
  }
}
