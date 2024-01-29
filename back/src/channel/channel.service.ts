import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ChannelRepository } from './repository/channel.repository';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Injectable()
export class ChannelService {
  constructor(
    private readonly repository: ChannelRepository,
    private readonly userRepository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  async create(createChanneltDto: CreateChannelDto, userId: any) {
    const channel = await this.repository.createChannel(
      createChanneltDto,
      userId,
    );
    this.addMember(userId, channel.channel_id, 'Admin', userId);
    return 'Canal criado';
  }

  async addMember(
    member_id: number,
    channel_id: number,
    status: string,
    userId: any,
  ) {
    const isAdmin = await this.repository.checkUser(channel_id, userId);
    const isOwner = await this.repository.checkOwner(channel_id, userId);
    if (isAdmin || isOwner) {
      const user = await this.userRepository.findOne(member_id);
      if (!user) {
        throw new NotFoundException('Membro não encontrado');
      }
      const member = await this.repository.checkMember(member_id, channel_id);
      if (member) {
        throw new ConflictException('O membro já está no canal');
      }
      this.repository.addUserToChannel(member_id, channel_id, status);
      return 'Adicionado com sucesso';
    } else {
      throw new UnauthorizedException('Você não é admin ou owner');
    }
  }

  async removeMember(member_id: number, channel_id: number, userId: any) {
    const isAdmin = await this.repository.checkUser(channel_id, userId);
    const isOwner = await this.repository.checkOwner(channel_id, userId);
    const memberIsOwner = await this.repository.checkOwner(
      channel_id,
      member_id,
    );
    if ((isAdmin || isOwner) && memberIsOwner == false) {
      const member = await this.repository.checkMember(member_id, channel_id);
      if (!member) {
        throw new BadRequestException('O membro não está no canal');
      }
      this.repository.removeMemberChannel(member_id, channel_id);
      return 'Membro removido';
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
    userId: any,
  ) {
    const isAdmin = await this.repository.checkUser(channel_id, userId);
    const isOwner = await this.repository.checkOwner(channel_id, userId);
    if (isAdmin || isOwner) {
      this.repository.changeMemberStatus(member_id, channel_id, status);
      return 'Status do membro alterado com sucesso';
    } else {
      throw new UnauthorizedException('Você não é admin ou owner');
    }
  }

  async listChannelsByUser(userId: any) {
    return this.repository.listChannelsByUser(userId);
  }

  async leaveChannel(channel_id: number, userId: any) {
    const admins = await this.repository.checkAdmins(userId, channel_id);
    if (admins.length === 0) {
      throw new ConflictException(
        'Não é possível sair do canal sem outros administradores.',
      );
    }
    const owner = await this.repository.checkOwner(channel_id, userId);
    if (owner === true) {
      this.repository.changeOwner(admins[0].user_id, channel_id);
      return 'Deixou o canal';
    }
    return this.repository.leaveChannel(userId, channel_id);
  }

  async listAllChannels() {
    return await this.repository.findAllChannels();
  }

  async enterChannel(channel_id: number, password: string, userId: any) {
    const channel = await this.repository.findChannel(channel_id);
    if (
      (channel.password === password || channel.type === 'Public') &&
      channel.type !== 'Restrict'
    ) {
      this.repository.addUserToChannel(userId, channel_id, 'Member');
      return 'Entrou no canal';
    } else {
      throw new UnauthorizedException('Não é possível entrar no canal.');
    }
  }

  async changePassword(channel_id: number, password: string, userId: any) {
    const isOwner = await this.repository.checkOwner(channel_id, userId);
    if (isOwner) {
      this.repository.changePassword(channel_id, password);
      return 'Password alterado';
    } else {
      throw new UnauthorizedException('Você não é owner');
    }
  }
}
