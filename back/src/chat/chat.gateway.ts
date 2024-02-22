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
import { Logger, NotFoundException } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { UsersService } from 'src/users/users.service';
import { FriendsService } from 'src/friends/friends.service';
import { FriendDto } from 'src/friends/dto/create-friend.dto';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelDto } from 'src/channel/dto/channel.dto';
import { CreateChannelDto } from 'src/channel/dto/create-channel.dto';
import { MemberDto } from 'src/channel/dto/member.dto';
import { LeaveDto } from 'src/channel/dto/leave.dto';
import { ChannelMemberStatus } from '../channel/constants';
import { ChatService } from './chat.service';
import { ChannelMessageDto } from 'src/channel/dto/channelMessage.dto.';
import { BlockUserDto } from 'src/users/dto/blockUser.dto';
import { AdminActionDto } from 'src/channel/dto/adminAction.dto';

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

  @SubscribeMessage('msg_to_server')
  async handleMessage(client: SocketWithAuth, chatDto: ChatDto): Promise<void> {
    try {
      chatDto.sender_id = client.userID;
      const members = await this.chatService.saveMessage(chatDto);
      members.forEach(member => {
        const memberId = this.users.get(member);
        client
          .to(memberId)
          .emit('refreshChat', `update the channel ${chatDto.channel_id}`);
      });
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
    try {
      const msgs = await this.chatService.getChatMessage(
        channelMessageDto.channel_id,
        client.userID,
      );
      client.emit('update_channel', msgs);
    } catch (error) {
      this.sendError(error);
    }
  }

  afterInit(server: Server) {
    this.logger.log(`Init: ${server}`);
  }

  private async notifyFriends(client: SocketWithAuth) {
    const friends = await this.usersService.findFriends(client.userID);
    friends.forEach(async friend => {
      const myFriend = this.users.get(friend.user_id);
      if (myFriend == null) {
        return;
      }
      client
        .to(myFriend)
        .emit('refresh_list', `Seu amigo ${client.username} está online`);
    });
  }

  async handleConnection(client: SocketWithAuth) {
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Client user: ${client.username}`);
    this.logger.log(`Client id: ${client.userID}`);
    this.users.set(client.userID, client.id);

    this.notifyFriends(client);

    await this.usersService.setStatus(client.userID, 'online');
    await this.listFriends(client);
  }

  @SubscribeMessage('get_friends')
  async listFriends(client: SocketWithAuth): Promise<void> {
    const friends = await this.usersService.findFriends(client.userID);
    const friendsList = friends.map(friend => ({
      userID: friend.user_id,
      userAvatarSrc: friend.avatar_url,
      username: friend.username,
      userStatus: this.users.has(friend.user_id) ? 'online' : 'offline',
    }));
    client.emit('update_friend_list', friendsList);
  }

  async handleDisconnect(client: SocketWithAuth) {
    this.logger.log(`Client disconnected: ${client.id}`);
    await this.usersService.setStatus(client.userID, 'offline');
    this.users.delete(client.userID);
    this.notifyFriends(client);
  }

  @SubscribeMessage('add_friend')
  async addFriend(client: SocketWithAuth, friendDto: FriendDto) {
    try {
      await this.friendService.addFriend(client.userID, friendDto.member_id);
      this.logger.log(
        `User ${client.userID} added ${friendDto.member_id} in listFriends.`,
      );
      this.notifyFriends(client);
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

  @SubscribeMessage('create_channel')
  async createChannel(client: SocketWithAuth, channelDto: CreateChannelDto) {
    try {
      const channel = await this.channelService.create(
        channelDto,
        client.userID,
      );
      this.logger.log(`User ${client.userID} created Channel ${channel}.`);
    } catch (error) {
      this.sendError(error);
    }
  }
  @SubscribeMessage('create_direct')
  async createDirect(client: SocketWithAuth, channelDto: CreateChannelDto) {
    channelDto.name = `direct_${client.userID}_${channelDto.member_id}`;
    try {
      const channel = await this.channelService.createDirect(
        channelDto,
        client.userID,
      );
      this.logger.log(`User ${client.userID} created Channel ${channel}.`);
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('add_member')
  async addMember(client: SocketWithAuth, memberDto: MemberDto) {
    try {
      this.checkType(memberDto);
      await this.channelService.addMember(memberDto, client.userID);
      this.logger.log(
        `Member ${memberDto.member_id} added by ${client.userID} in channel ${memberDto.channel_id}.`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('change_member_status')
  async changeMemberStatus(client: SocketWithAuth, memberDto: MemberDto) {
    try {
      await this.channelService.changeMemberStatus(memberDto, client.userID);
      this.logger.log(
        `Member ${memberDto.member_id} have changed status to ${memberDto.status} by ${client.userID} in channel ${memberDto.channel_id}.`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('admin_action')
  async adminAction(client: SocketWithAuth, adminActionDto: AdminActionDto) {
    try {
      await this.channelService.adminAction(adminActionDto, client.userID);
      this.logger.log(
        `User ${client.userID} ${adminActionDto.action} member ${adminActionDto.member_id} to ${adminActionDto.end_date} minutes`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('leave_channel')
  async leaveChannel(client: SocketWithAuth, leaveDto: LeaveDto) {
    try {
      await this.channelService.leaveChannel(leaveDto, client.userID);
      this.logger.log(
        `User ${client.userID} leave channel ${leaveDto.channel_id}`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('join_channel')
  async joinChannel(client: SocketWithAuth, channelDto: ChannelDto) {
    try {
      await this.channelService.joinChannel(channelDto, client.userID);
      this.logger.log(
        `User ${client.userID} joined the channel ${channelDto.channel_id}.`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }

  @SubscribeMessage('change_password')
  async changePassword(client: SocketWithAuth, channelDto: ChannelDto) {
    try {
      await this.channelService.changePassword(channelDto, client.userID);
      this.logger.log(
        `User ${client.userID} changed password in channel ${channelDto.channel_id}.`,
      );
    } catch (error) {
      this.sendError(error);
    }
  }

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
