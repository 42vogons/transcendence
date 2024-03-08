import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsException,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketWithAuth } from 'src/types';
import {
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { UsersService } from 'src/users/users.service';
import { FriendsService } from 'src/friends/friends.service';
import { FriendDto } from 'src/friends/dto/create-friend.dto';
import { ChannelService } from 'src/channel/channel.service';
import { CreateChannelDto } from 'src/channel/dto/create-channel.dto';
import { MemberDto } from 'src/channel/dto/member.dto';
import { LeaveDto } from 'src/channel/dto/leave.dto';
import { AdminActionType, ChannelMemberStatus } from '../channel/constants';
import { ChatService } from './chat.service';
import { ChannelMessageDto } from 'src/channel/dto/channelMessage.dto.';
import { BlockUserDto } from 'src/users/dto/blockUser.dto';
import { AdminActionDto } from 'src/channel/dto/adminAction.dto';
import { setTimeout } from 'timers/promises';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  users = new Map();

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly usersService: UsersService,
    private readonly friendService: FriendsService,
    private readonly channelService: ChannelService,
    private readonly chatService: ChatService,
  ) {}

  afterInit(server: Server) {
    this.logger.log(`Init: ${server}`);
  }

  async handleConnection(client: SocketWithAuth) {
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Client user: ${client.username}`);
    this.logger.log(`Client id: ${client.userID}`);
    this.users.set(client.userID, client.id);

    this.notifyFriends(client.userID);

    await this.usersService.setStatus(client.userID, 'online');
    await this.listFriends(client);
    const lastMessageChannel = await this.channelService.getLastChannelMessage(
      client.userID,
    );
    client.emit('refresh_channel_list', lastMessageChannel);
  }

  async handleDisconnect(client: SocketWithAuth) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.usersService.setStatus(client.userID, 'offline');
    this.users.delete(client.userID);
    this.notifyFriends(client.userID);
  }

  @SubscribeMessage('msg_to_server')
  async handleMessage(client: SocketWithAuth, chatDto: ChatDto): Promise<void> {
    try {
      await this.channelService.checkAction(
        client.userID,
        chatDto.channel_id,
        AdminActionType.BANNED,
        'error',
      );
      await this.channelService.checkAction(
        client.userID,
        chatDto.channel_id,
        AdminActionType.KICKED,
        'error',
      );

      chatDto.sender_id = client.userID;
      await this.chatService.saveMessage(chatDto);
      await this.notifyMembers(chatDto.channel_id);
      this.logger.log(
        `User ${client.userID} sent message on channel ${chatDto.channel_id}`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('get_channel_msg')
  async listChannelMsg(
    client: SocketWithAuth,
    channelMessageDto: ChannelMessageDto,
  ): Promise<void> {
    console.log('getchannelMessageDto:', channelMessageDto);
    try {
      const msgs = await this.chatService.getChatMessage(
        channelMessageDto.channel_id,
        client.userID,
      );
      const channel = await this.channelService.findChannel(
        channelMessageDto.channel_id,
      );
      delete channel.password;
      const channelMembers = await this.channelService.getChannelMembers(
        channelMessageDto.channel_id,
      );
      client.emit('update_channel', {
        channel,
        channelMembers,
        msgs,
      });
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('get_friends')
  async listFriends(client: SocketWithAuth): Promise<void> {
    const friends = await this.usersService.findFriends(client.userID);
    const friendsList = friends.map(friend => ({
      userID: friend.user_id,
      userAvatarSrc: friend.avatar_url,
      username: friend.username,
      userStatus: this.users.has(friend.user_id) ? friend.status : 'offline',
    }));
    client.emit('update_friend_list', friendsList);
  }

  @SubscribeMessage('add_friend')
  async addFriend(client: SocketWithAuth, friendDto: FriendDto) {
    try {
      await this.friendService.addFriend(client.userID, friendDto.member_id);
      this.logger.log(
        `User ${client.userID} added ${friendDto.member_id} in listFriends.`,
      );
      this.notifyFriends(client.userID);
      client.emit('refresh_list', ``);
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('remove_friend')
  async removeFriend(client: SocketWithAuth, friendDto: FriendDto) {
    try {
      await this.friendService.removeFriend(client.userID, friendDto.member_id);
      this.logger.log(
        `User ${client.userID} removed ${friendDto.member_id} in listFriends.`,
      );
      const friendClientId = this.users.get(friendDto.member_id);
      client.to(friendClientId).emit('refresh_list', ``);
      client.emit('refresh_list', ``);
    } catch (error) {
      this.sendError(error);
    }
  }

  /*@SubscribeMessage('create_channel')
  async createChannel(client: SocketWithAuth, channelDto: CreateChannelDto) {
    try {
      const channel = await this.channelService.create(
        channelDto,
        client.userID,
      );
      const userName = this.usersService.findUsernameByUserID(client.userID);
      const msg = `Channel created by ${userName}`;
      this.logger.log(msg);
      await this.chatService.sendBroadCast(channel, msg);
      await this.notifyMembers(channel);
    } catch (error) {
      this.sendError(error);
    }
  }*/
  @SubscribeMessage('create_direct')
  async createDirect(client: SocketWithAuth, channelDto: CreateChannelDto) {
    channelDto.name = `direct_${client.userID}_${channelDto.member_id}`;
    try {
      const channel = await this.channelService.createDirect(
        channelDto,
        client.userID,
      );
      const userName = await this.usersService.findUsernameByUserID(
        client.userID,
      );
      const msg = `Chat created by ${userName}`;
      this.logger.log(msg);
      await this.chatService.sendBroadCast(channel, msg);
      await this.notifyMembers(channel);
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('add_member')
  async addMember(client: SocketWithAuth, memberDto: MemberDto) {
    try {
      this.checkType(memberDto);
      await this.channelService.checkAction(
        memberDto.member_id,
        memberDto.channel_id,
        AdminActionType.BANNED,
        'error',
      );
      await this.channelService.addMember(memberDto, client.userID);

      const adminName = await this.usersService.findUsernameByUserID(
        client.userID,
      );
      const memberName = await this.usersService.findUsernameByUserID(
        memberDto.member_id,
      );
      const msg = `${adminName} added ${memberName} to the channel`;
      this.logger.log(msg);
      await this.chatService.sendBroadCast(memberDto.channel_id, msg);
      await this.notifyMembers(memberDto.channel_id);
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('change_member_status')
  async changeMemberStatus(client: SocketWithAuth, memberDto: MemberDto) {
    try {
      await this.channelService.changeMemberStatus(memberDto, client.userID);
      const adminName = await this.usersService.findUsernameByUserID(
        client.userID,
      );
      const memberName = await this.usersService.findUsernameByUserID(
        memberDto.member_id,
      );
      const msg = `${adminName}  changed ${memberName}'s status to ${memberDto.status}`;
      this.logger.log(msg + 'on channel' + memberDto.channel_id);
      await this.chatService.sendBroadCast(memberDto.channel_id, msg);
      await this.notifyMembers(memberDto.channel_id);
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('admin_action')
  async adminAction(client: SocketWithAuth, adminActionDto: AdminActionDto) {
    try {
      const adminName = await this.usersService.findUsernameByUserID(
        client.userID,
      );
      const memberName = await this.usersService.findUsernameByUserID(
        adminActionDto.member_id,
      );
      const isOwner = await this.channelService.checkOwner(
        adminActionDto.channel_id,
        adminActionDto.member_id,
      );
      if (isOwner === true) {
        throw new UnauthorizedException(
          `You can't  ${adminActionDto.action} the owner of this channel.`,
        );
      }

      this.channelService.checkAction(
        adminActionDto.member_id,
        adminActionDto.channel_id,
        AdminActionType.BANNED,
        'error',
      );

      this.channelService.checkAction(
        adminActionDto.member_id,
        adminActionDto.channel_id,
        AdminActionType.KICKED,
        'error',
      );

      let msg = `${adminName} ${
        adminActionDto.action === 'ban'
          ? 'banned'
          : adminActionDto.action === 'kick'
            ? 'kicked'
            : 'muted'
      } ${memberName}`;
      if (adminActionDto.action === AdminActionType.MUTED) {
        msg += ` for ${adminActionDto.end_date} minute(s)`;
      }
      this.logger.log(msg + 'on channel' + adminActionDto.channel_id);
      await this.chatService.sendBroadCast(adminActionDto.channel_id, msg);
      await this.notifyMembers(adminActionDto.channel_id);
      await this.channelService.adminAction(adminActionDto, client.userID);
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('leave_channel')
  async leaveChannel(client: SocketWithAuth, leaveDto: LeaveDto) {
    try {
      await this.channelService.leaveChannel(leaveDto, client.userID);
      const memberName = await this.usersService.findUsernameByUserID(
        client.userID,
      );
      const msg = `${memberName} left the channel`;
      this.logger.log(msg + 'on channel' + leaveDto.channel_id);
      const isBanned = this.channelService.checkAction(
        client.userID,
        leaveDto.channel_id,
        AdminActionType.BANNED,
        'status',
      );
      const isKicked = this.channelService.checkAction(
        client.userID,
        leaveDto.channel_id,
        AdminActionType.KICKED,
        'status',
      );

      // ajustar essa msg?
      if (isKicked != null || isBanned != null) {
        return;
      }
      await this.chatService.sendBroadCast(leaveDto.channel_id, msg);
      await this.notifyMembers(leaveDto.channel_id);
      client.emit('left_the_channel');
    } catch (error) {
      this.sendError(error);
    }
  }

  /*
  @SubscribeMessage('join_channel')
  async joinChannel(client: SocketWithAuth, channelDto: ChannelDto) {
    try {
      await this.channelService.joinChannel(channelDto, client.userID);
      const memberName = this.usersService.findUsernameByUserID(client.userID);
      const msg = `${memberName} joined the channel`;
      this.logger.log(msg + 'on channel' + channelDto.channel_id);
      await this.chatService.sendBroadCast(channelDto.channel_id, msg);
      await this.notifyMembers(channelDto.channel_id);
    } catch (error) {
      this.sendError(error);
    }
  }*/

  /*@SubscribeMessage('change_password')
  async changePassword(client: SocketWithAuth, channelDto: ChannelDto) {
    try {
      await this.channelService.changePassword(channelDto, client.userID);
      this.logger.log(
        `User ${client.userID} changed password in channel ${channelDto.channel_id}.`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }*/

  @SubscribeMessage('block_user')
  async blockUser(client: SocketWithAuth, blockUser: BlockUserDto) {
    try {
      blockUser.user_id = client.userID;
      await this.usersService.blockUser(blockUser);
      this.logger.log(`User ${client.userID} Blocked ${blockUser.member_id}.`);
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('update_channel_list')
  async getLastChannelMessage(client: SocketWithAuth) {
    const lastMessageChannel = await this.channelService.getLastChannelMessage(
      client.userID,
    );
    client.emit('refresh_channel_list', lastMessageChannel);
  }

  @SubscribeMessage('un_block_user')
  async unBlockUser(client: SocketWithAuth, blockUser: BlockUserDto) {
    try {
      blockUser.user_id = client.userID;
      await this.usersService.unBlockUser(blockUser);
      this.logger.log(
        `User ${client.userID} UnBlocked ${blockUser.member_id}.`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }

  public async notifyFriends(userID) {
    const friends = await this.usersService.findFriends(userID);
    friends.forEach(async friend => {
      const myFriend = this.users.get(friend.user_id);
      if (myFriend == null) {
        return;
      }
      this.server.to(myFriend).emit('refresh_list', ``);
    });
  }

  private async notifyMembers(channel_id: number) {
    await setTimeout(100);
    const members = await this.channelService.getChannelMembers(channel_id);
    members.forEach(async member => {
      const memberId = this.users.get(member.user_id);
      const isBanned = await this.channelService.checkAction(
        member.user_id,
        channel_id,
        AdminActionType.BANNED,
        'status',
      );
      if (!isBanned) {
        this.server
          .to(memberId)
          .emit('refresh_chat', { channelID: channel_id });
        const lastMessageChannel =
          await this.channelService.getLastChannelMessage(member.user_id);
        this.server
          .to(memberId)
          .emit('refresh_channel_list', lastMessageChannel);
      }
    });
  }

  private sendError(error: any) {
    if (error instanceof Error) {
      error = { message: error.message, stack: error.stack };
      this.logger.error(error.message);
      throw new WsException(error);
    }
  }
  private checkType(memberDto: MemberDto) {
    if (
      !Object.values(ChannelMemberStatus).includes(
        memberDto.status as ChannelMemberStatus,
      )
    ) {
      throw new NotFoundException('Invalid member status');
    }
  }
}
