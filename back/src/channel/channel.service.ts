import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChannelRepository } from './repository/channel.repository';
import { CreateChannelDto } from './dto/create-channel.dto';
import { UsersRepository } from 'src/users/repositories/users.repository';

import * as bcrypt from 'bcryptjs';
import { MemberDto } from './dto/member.dto';
import { AdminActionDto } from './dto/adminAction.dto';
import { LeaveDto } from './dto/leave.dto';
import { ChannelDto } from './dto/channel.dto';
import { ChannelType, ChannelMemberStatus, AdminActionType } from './constants';
import { channel_listDTO } from './dto/channelList.dto';
import { ChatDto } from 'src/chat/dto/chat.dto';
import { ChatRepository } from 'src/chat/repository/chat.repository';
import { z } from 'zod';
import { UpdateChannelDto } from './dto/update-channel.dto';

@Injectable()
export class ChannelService {
  constructor(
    private readonly repository: ChannelRepository,
    private readonly userRepository: UsersRepository,
    private readonly chatRepository: ChatRepository,
  ) {}

  private logger: Logger = new Logger('AppGateway');

  async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(password, saltOrRounds);
    return hash;
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }

  async createDirect(
    createChanneltDto: CreateChannelDto,
    user_id: number,
  ): Promise<number> {
    if (
      !Object.values(ChannelType).includes(
        createChanneltDto.type as ChannelType,
      )
    ) {
      throw new BadRequestException('Invalid channel type.');
    }
    if (user_id === createChanneltDto.member_id) {
      throw new BadRequestException(
        'You can not create a channel with yourself.',
      );
    }
    const existChannel = await this.repository.directChannelExists(
      user_id,
      createChanneltDto.member_id,
    );
    if (existChannel) {
      throw new ConflictException('Channel already exists.');
    }
    const channel = await this.repository.createChannel(
      createChanneltDto,
      user_id,
    );
    const member = new MemberDto();
    member.channel_id = channel.channel_id;
    member.status = ChannelMemberStatus.MEMBER;
    member.member_id = user_id;
    await this.addMember(member, user_id);
    member.member_id = createChanneltDto.member_id;
    await this.addMember(member, user_id);
    return channel.channel_id;
  }

  async create(
    createChanneltDto: CreateChannelDto,
    userId: number,
  ): Promise<any> {
    if (
      !Object.values(ChannelType).includes(
        createChanneltDto.type as ChannelType,
      )
    ) {
      throw new BadRequestException('Invalid channel type.');
    }
    if (createChanneltDto.type === 'protected') {
      this.checkValidPassword(createChanneltDto.password);
      const hashPassword = await this.hashPassword(createChanneltDto.password);
      createChanneltDto.password = hashPassword;
    }

    const channel = await this.repository.createChannel(
      createChanneltDto,
      userId,
    );

    const userName = await this.userRepository.findUsernameByUserID(userId);
    const msg = `Channel created by ${userName}`;
    this.logger.log(msg);
    this.sendBroadCast(channel.channel_id, msg);
    const member = new MemberDto();
    member.channel_id = channel.channel_id;
    member.status = ChannelMemberStatus.OWNER;
    member.member_id = userId;
    this.addMember(member, userId);
    return channel.channel_id;
  }

  async updateChannel(
    updateChannelDto: UpdateChannelDto,
    userId: number,
    channelId: number,
  ): Promise<any> {
    const isAdmin = await this.repository.checkUser(channelId, userId);
    const isOwner = await this.repository.checkOwner(channelId, userId);
    if (!isAdmin && !isOwner) {
      throw new UnauthorizedException(
        'You are not an admin or owner of this channel.',
      );
    }
    if ((updateChannelDto.password || updateChannelDto.type) && !isOwner) {
      throw new UnauthorizedException('You are not an owner of this channel.');
    }
    if (
      !Object.values(ChannelType).includes(updateChannelDto.type as ChannelType)
    ) {
      throw new BadRequestException('Invalid channel type.');
    }
    if (updateChannelDto.type === 'protected') {
      this.checkValidPassword(updateChannelDto.password);
      const hashPassword = await this.hashPassword(updateChannelDto.password);
      updateChannelDto.password = hashPassword;
    }

    const channel = await this.repository.updateChannel(
      channelId,
      updateChannelDto,
    );
    return channel.channel_id;
  }

  async addMember(memberDto: MemberDto, userId: number) {
    const isAdmin = await this.repository.checkUser(
      memberDto.channel_id,
      userId,
    );
    const isOwner = await this.checkOwner(memberDto.channel_id, userId);

    if (isAdmin || isOwner) {
      const user = await this.userRepository.findOne(memberDto.member_id);
      if (!user) {
        throw new NotFoundException('Member not found.');
      }
      const member = await this.repository.checkMember(
        memberDto.member_id,
        memberDto.channel_id,
      );
      if (member) {
        throw new ConflictException('The member is already in the channel.');
      }
      this.repository.addUserToChannel(
        memberDto.member_id,
        memberDto.channel_id,
        memberDto.status,
      );
      return 'Successfully added.';
    } else {
      throw new UnauthorizedException(
        'You are not an admin or owner of this channel.',
      );
    }
  }

  async adminAction(adminActionDto: AdminActionDto, userId: number) {
    const isAdmin = await this.repository.checkUser(
      adminActionDto.channel_id,
      userId,
    );
    const isOwner = await this.checkOwner(adminActionDto.channel_id, userId);
    const memberIsOwner = await this.checkOwner(
      adminActionDto.channel_id,
      adminActionDto.member_id,
    );
    if ((isAdmin || isOwner) && memberIsOwner == false) {
      const member = await this.repository.checkMember(
        adminActionDto.member_id,
        adminActionDto.channel_id,
      );
      if (!member) {
        throw new NotFoundException('The member is not in the channel.');
      }
      if (adminActionDto.end_date == null) {
        adminActionDto.end_date = 0;
      }
      await this.repository.adminAction(adminActionDto, userId);

      if (adminActionDto.action === AdminActionType.KICKED) {
        await this.repository.removeMemberChannel(
          adminActionDto.member_id,
          adminActionDto.channel_id,
        );
        return 'Member removed.';
      }
      if (adminActionDto.action === AdminActionType.MUTED) {
        return 'Member muted.';
      }
      if (adminActionDto.action === AdminActionType.BANNED) {
        await this.repository.removeMemberChannel(
          adminActionDto.member_id,
          adminActionDto.channel_id,
        );
        return 'Member banned.';
      }
    } else {
      throw new UnauthorizedException(
        'You are not an admin or owner of this channel.',
      );
    }
  }

  async changeMemberStatus(memberDto: MemberDto, userId: any) {
    const isAdmin = await this.repository.checkUser(
      memberDto.channel_id,
      userId,
    );

    const isMemberOwner = await this.checkOwner(
      memberDto.channel_id,
      memberDto.member_id,
    );
    if (isMemberOwner === true) {
      throw new UnauthorizedException(
        `You can't change status the owner of this channel.`,
      );
    }

    const isOwner = await this.checkOwner(memberDto.channel_id, userId);
    if (isAdmin || isOwner) {
      await this.repository.changeMemberStatus(memberDto);
      return 'Member status changed successfully.';
    } else {
      throw new UnauthorizedException(
        'You are not an admin or owner of this channel.',
      );
    }
  }

  async listChannelsByUser(userId: any) {
    return await this.repository.listChannelsByUser(userId);
  }

  async listLastChannelMsg(userId: any) {
    return await this.repository.listChannelsByUser(userId);
  }

  async checkOwner(channel_id: number, userId: number) {
    return await this.repository.checkOwner(channel_id, userId);
  }

  async leaveChannel(leaveDto: LeaveDto, userId: any) {
    const admins = await this.repository.checkAdmins(
      userId,
      leaveDto.channel_id,
    );
    const owner = await this.checkOwner(leaveDto.channel_id, userId);
    const members = await this.repository.listMembers(leaveDto.channel_id);
    if (admins.length === 0 && owner === true && members.length > 1) {
      throw new ConflictException(
        'Cannot leave the channel without appointing another administrator.',
      );
    }
    if (owner === true && admins.length > 0) {
      await this.repository.changeOwner(admins[0].user_id, leaveDto.channel_id);
    }
    await this.repository.leaveChannel(userId, leaveDto.channel_id);
    return 'Left the channel.';
  }

  async listAllChannels(member_id: number) {
    return await this.repository.findAllChannels(member_id);
  }

  async joinChannel(channelDto: ChannelDto, userId: any) {
    const channel = await this.repository.findChannel(channelDto.channel_id);

    const member = await this.repository.checkMember(
      userId,
      channelDto.channel_id,
    );

    if (member) {
      throw new ConflictException('You are already a member of the channel.');
    }
    await this.checkBanned(userId, channelDto.channel_id);

    const validPassword = await this.validatePassword(
      channelDto.password,
      channel.password,
    );
    if (
      (validPassword || channel.type === ChannelType.PUBLIC) &&
      channel.type !== ChannelType.PRIVATE
    ) {
      await this.repository.addUserToChannel(
        userId,
        channelDto.channel_id,
        ChannelMemberStatus.MEMBER,
      );

      const memberName = this.userRepository.findUsernameByUserID(userId);
      const msg = `${memberName} joined`;
      this.logger.log(msg + ' on channel ' + channelDto.channel_id);
      await this.sendBroadCast(channelDto.channel_id, msg);
      return 'Joined the channel.';
    } else {
      throw new UnauthorizedException('Unable to join the channel.');
    }
  }

  async changePassword(channelDto: ChannelDto, userId: any) {
    const isOwner = await this.checkOwner(channelDto.channel_id, userId);
    if (isOwner) {
      this.checkValidPassword(channelDto.password);
      const hashPassword = await this.hashPassword(channelDto.password);
      channelDto.password = hashPassword;
      await this.repository.changePassword(channelDto);
      const memberName = this.userRepository.findUsernameByUserID(userId);
      const msg = `${memberName} changed password`;
      this.logger.log(msg + ' on channel ' + channelDto.channel_id);
      await this.sendBroadCast(channelDto.channel_id, msg);
      return 'Password changed.';
    } else {
      throw new UnauthorizedException('You are not an owner of this channel.');
    }
  }

  async checkBanned(member_id: number, channel_id: number) {
    const adminAction = await this.checkAdminActions(member_id, channel_id);
    if (adminAction == null) {
      return null;
    }
    if (adminAction.action_type === AdminActionType.BANNED) {
      throw new ForbiddenException('Member is banned.');
    }
  }

  async checkMuted(member_id: number, channel_id: number) {
    const adminAction = await this.checkAdminActions(member_id, channel_id);
    if (adminAction == null) {
      return null;
    }
    if (adminAction.action_type == AdminActionType.MUTED) {
      if (adminAction.end_time > new Date()) {
        throw new ForbiddenException('Member is muted.');
      }
    }
  }

  async checkAdminActions(member_id: number, channel_id: number) {
    return await this.repository.getLastAdminActionByUser(
      member_id,
      channel_id,
    );
  }

  async getLastChannelMessage(user_id: number): Promise<channel_listDTO[]> {
    return await this.repository.getLastMessagesForUserChannels(user_id);
  }

  async findChannel(channel_id: number) {
    return await this.repository.findChannel(channel_id);
  }

  async getChannelMembers(channel_id: number) {
    return await this.repository.listMembers(channel_id);
  }

  async sendBroadCast(channel_id: number, msg: string) {
    const chatDto = new ChatDto();
    chatDto.channel_id = channel_id;
    chatDto.sender_id = 1;
    chatDto.content = msg;
    await this.chatRepository.saveMessage(chatDto);
  }

  private checkValidPassword(password: string) {
    const passwordSchema = z
      .string()
      .min(6)
      .refine(pwd => /[0-9]/.test(pwd))
      .refine(pwd => /[!@#$%^&*(),.?":{}|<>]/.test(pwd))
      .refine(pwd => /[A-Z]/.test(pwd));

    const result = passwordSchema.safeParse(password);
    if (!result.success) {
      throw new BadRequestException(
        'The password must contain 6 characters, including 1 special character, 1 numeric character and 1 upper',
      );
    }
  }
}
