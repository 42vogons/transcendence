import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChannelRepository } from './repository/channel.repository';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';

import * as bcrypt from 'bcryptjs';
import { MemberDto } from './dto/member.dto';
import { RemoveMemberDto } from './dto/removeMember.dto copy';
import { LeaveDto } from './dto/leave.dto';
import { ChannelDto } from './dto/channel.dto';
import { ChannelType, ChannelMemberStatus } from './constants';

@Injectable()
export class ChannelService {
  constructor(
    private readonly repository: ChannelRepository,
    private readonly userRepository: UsersRepository,
  ) {}

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async createDirect(createChanneltDto: CreateChannelDto, user_id: number) {
    if (
      !Object.values(ChannelType).includes(
        createChanneltDto.type as ChannelType,
      )
    ) {
      throw new Error('Invalid channel type');
    }
    const existChannel = await this.repository.directChannelExists(
      user_id,
      createChanneltDto.member_id,
    );
    if (existChannel) {
      console.log('canal já existe');
      return 'canal já existe';
    }
    const channel = await this.repository.createChannel(
      createChanneltDto,
      user_id,
    );
    const member = new MemberDto();
    member.channel_id = channel.channel_id;
    member.status = ChannelMemberStatus.ADMIN;
    member.member_id = user_id;
    await this.addMember(member, user_id);
    member.member_id = createChanneltDto.member_id;
    await this.addMember(member, user_id);
  }

  async create(createChanneltDto: CreateChannelDto, userId: number) {
    if (
      !Object.values(ChannelType).includes(
        createChanneltDto.type as ChannelType,
      )
    ) {
      throw new Error('Invalid channel type');
    }
    if (createChanneltDto.type === 'protected') {
      const hashPassword = await this.hashPassword(createChanneltDto.password);
      createChanneltDto.password = hashPassword;
    }
    const channel = await this.repository.createChannel(
      createChanneltDto,
      userId,
    );
    const member = new MemberDto();
    member.channel_id = channel.channel_id;
    member.status = ChannelMemberStatus.ADMIN;
    member.member_id = userId;
    this.addMember(member, userId);
    return 'Canal criado';
  }

  async addMember(memberDto: MemberDto, userId: number) {
    const isAdmin = await this.repository.checkUser(
      memberDto.channel_id,
      userId,
    );
    const isOwner = await this.repository.checkOwner(
      memberDto.channel_id,
      userId,
    );
    if (isAdmin || isOwner) {
      const user = await this.userRepository.findOne(memberDto.member_id);
      if (!user) {
        throw new NotFoundException('Membro não encontrado');
      }
      const member = await this.repository.checkMember(
        memberDto.member_id,
        memberDto.channel_id,
      );
      if (member) {
        throw new ConflictException('O membro já está no canal');
      }
      this.repository.addUserToChannel(
        memberDto.member_id,
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
      this.repository.changeMemberStatus(memberDto);
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

  async joinChannel(channelDto: ChannelDto, userId: any) {
    const channel = await this.repository.findChannel(channelDto.channel_id);

    const member = await this.repository.checkMember(
      userId,
      channelDto.channel_id,
    );
    if (member) {
      throw new ConflictException('Você já é membro do canal');
    }
    const validPassword = await this.validatePassword(
      channelDto.password,
      channel.password,
    );
    if (
      (validPassword || channel.type === ChannelType.PUBLIC) &&
      channel.type !== ChannelType.PRIVATE
    ) {
      this.repository.addUserToChannel(
        userId,
        channelDto.channel_id,
        ChannelMemberStatus.MEMBER,
      );
      return 'Entrou no canal';
    } else {
      throw new UnauthorizedException('Não é possível entrar no canal.');
    }
  }

  async changePassword(channelDto: ChannelDto, userId: any) {
    const isOwner = await this.repository.checkOwner(
      channelDto.channel_id,
      userId,
    );
    if (isOwner) {
      const hashPassword = await this.hashPassword(channelDto.password);
      channelDto.password = hashPassword;
      this.repository.changePassword(channelDto);
      return 'Password alterado';
    } else {
      throw new UnauthorizedException('Você não é owner');
    }
  }
}
