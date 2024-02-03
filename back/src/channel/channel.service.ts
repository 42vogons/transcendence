import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChannelRepository } from './repository/channel.repository';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';

import * as argon2 from 'argon2';
import { MemberDto } from './dto/member.dto';
import { RemoveMemberDto } from './dto/removeMember.dto copy';
import { LeaveDto } from './dto/leave.dto';
import { ChannelDto } from './dto/channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly repository: ChannelRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return await argon2.hash(password);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await argon2.verify(hash, password);
  }

  async create(createChanneltDto: CreateChannelDto, userId: any) {
    createChanneltDto.password = await this.hashPassword(
      createChanneltDto.password,
    );
    const channel = await this.repository.createChannel(
      createChanneltDto,
      userId,
    );
    const member = new MemberDto();
    member.channel_id = channel.channel_id;
    member.status = 'Admin';
    member.user_id = userId;
    this.addMember(member, userId);
    return 'Canal criado';
  }

  async addMember(memberDto: MemberDto, userId: any) {
    const isAdmin = await this.repository.checkUser(
      memberDto.channel_id,
      userId,
    );
    const isOwner = await this.repository.checkOwner(
      memberDto.channel_id,
      userId,
    );
    if (isAdmin || isOwner) {
      const user = await this.userRepository.findOne(memberDto.user_id);
      if (!user) {
        throw new NotFoundException('Membro não encontrado');
      }
      const member = await this.repository.checkMember(
        memberDto.user_id,
        memberDto.channel_id,
      );
      if (member) {
        throw new ConflictException('O membro já está no canal');
      }
      this.repository.addUserToChannel(
        memberDto.user_id,
        memberDto.channel_id,
        memberDto.status,
      );
      return 'Adicionado com sucesso';
    } else {
      throw new UnauthorizedException('Você não é admin ou owner');
    }
  }

  async removeMember(memberDto: RemoveMemberDto, userId: any) {
    const isAdmin = await this.repository.checkUser(
      memberDto.channel_id,
      userId,
    );
    const isOwner = await this.repository.checkOwner(
      memberDto.channel_id,
      userId,
    );
    const memberIsOwner = await this.repository.checkOwner(
      memberDto.channel_id,
      memberDto.member_id,
    );
    if ((isAdmin || isOwner) && memberIsOwner == false) {
      const member = await this.repository.checkMember(
        memberDto.member_id,
        memberDto.channel_id,
      );
      if (!member) {
        throw new NotFoundException('O membro não está no canal');
      }
      this.repository.removeMemberChannel(
        memberDto.member_id,
        memberDto.channel_id,
      );
      return 'Membro removido';
    } else {
      throw new UnauthorizedException(
        'Você não é admin ou owner, ou não pode excluir o owner',
      );
    }
  }

  async changeMemberStatus(memberDto: MemberDto, userId: any) {
    const isAdmin = await this.repository.checkUser(
      memberDto.channel_id,
      userId,
    );
    const isOwner = await this.repository.checkOwner(
      memberDto.channel_id,
      userId,
    );
    if (isAdmin || isOwner) {
      this.repository.changeMemberStatus(
        memberDto.user_id,
        memberDto.channel_id,
        memberDto.status,
      );
      return 'Status do membro alterado com sucesso';
    } else {
      throw new UnauthorizedException('Você não é admin ou owner');
    }
  }

  async listChannelsByUser(userId: any) {
    return this.repository.listChannelsByUser(userId);
  }

  async leaveChannel(leaveDto: LeaveDto, userId: any) {
    const admins = await this.repository.checkAdmins(
      userId,
      leaveDto.channel_id,
    );
    if (admins.length === 0) {
      throw new ConflictException(
        'Não é possível sair do canal sem outros administradores.',
      );
    }
    const owner = await this.repository.checkOwner(leaveDto.channel_id, userId);
    if (owner === true) {
      this.repository.changeOwner(admins[0].user_id, leaveDto.channel_id);
      return 'Deixou o canal';
    }
    return this.repository.leaveChannel(userId, leaveDto.channel_id);
  }

  async listAllChannels() {
    return await this.repository.findAllChannels();
  }

  async enterChannel(chanelDto: ChannelDto, userId: any) {
    const channel = await this.repository.findChannel(chanelDto.channel_id);
    const validPassword = await this.validatePassword(
      chanelDto.password,
      channel.password,
    );
    if (
      (validPassword || channel.type === 'Public') &&
      channel.type !== 'Restrict'
    ) {
      this.repository.addUserToChannel(userId, chanelDto.channel_id, 'Member');
      return 'Entrou no canal';
    } else {
      throw new UnauthorizedException('Não é possível entrar no canal.');
    }
  }

  async changePassword(chanelDto: ChannelDto, userId: any) {
    const isOwner = await this.repository.checkOwner(
      chanelDto.channel_id,
      userId,
    );
    if (isOwner) {
      this.repository.changePassword(chanelDto.channel_id, chanelDto.password);
      return 'Password alterado';
    } else {
      throw new UnauthorizedException('Você não é owner');
    }
  }
}
