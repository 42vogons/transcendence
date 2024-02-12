import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { SocketWithAuth } from 'src/types';
import { Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatDto } from './dto/chat.dto';
import { UsersService } from 'src/users/users.service';
import { FriendsService } from 'src/friends/friends.service';
import { FriendDto } from 'src/friends/dto/create-friend.dto';
import { ChannelService } from 'src/channel/channel.service';
import { ChannelDto } from 'src/channel/dto/channel.dto';
import { CreateChannelDto } from 'src/channel/dto/create-channel.dto';
import { MemberDto } from 'src/channel/dto/member.dto';
import { RemoveMemberDto } from 'src/channel/dto/removeMember.dto copy';
import { LeaveDto } from 'src/channel/dto/leave.dto';
import { ChannelMemberStatus } from '../channel/constants';
import { ChatService } from './chat.service';
import { ChannelMessageDto } from 'src/channel/dto/channelMessage.dto.';
import { BlockUserDto } from 'src/users/dto/blockUser.dto';

@WebSocketGateway({ namespace: 'chat' })
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  users = new Map();

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(
    private readonly prisma: PrismaService,
    private readonly usersService: UsersService,
    private readonly friendService: FriendsService,
    private readonly channelService: ChannelService,
    private readonly chatService: ChatService,
  ) {}

  @SubscribeMessage('msgToServer')
  async handleMessage(client: SocketWithAuth, chatDto: ChatDto): Promise<void> {
    try {
      const newMessage = await this.chatService.saveMessage(chatDto);
      this.logger.log(`Received ${JSON.stringify(newMessage)}`);
      this.server.emit('msgToClient', newMessage, client.id);
    } catch (error) {
      console.error('Error creating message:', error);
    }
  }

  @SubscribeMessage('getChannelMsg')
  async listChannelMsg(
    client: SocketWithAuth,
    channelMessageDto: ChannelMessageDto,
  ): Promise<void> {
    return await this.chatService.getChatMessage(
      channelMessageDto.channel_id,
      client.userID,
    );
  }

  afterInit(server: Server) {
    this.logger.log(`Init: ${server}`);
  }

  async handleConnection(client: SocketWithAuth) {
    this.logger.log(`Client connected: ${client.id}`);
    this.logger.log(`Client user: ${client.username}`);
    this.logger.log(`Client id: ${client.userID}`);
    this.users.set(client.userID, client.id);
    const friends = await this.usersService.findFriends(client.userID);
    await this.usersService.setStatus(client.userID, 'online');

    friends.forEach(friend => {
      console.log('seu amigo ' + friend.user_id);
      const myFriend = this.users.get(friend.user_id);
      if (myFriend == null) {
        return;
      }
      client
        .to(myFriend)
        .emit('refreshList', `Seu amigo ${client.username} está online`);
    });
    await this.listFriends(client);
    /*try {
      const messages = await this.prisma.chat_messages.findMany({
        orderBy: {
          timestamp: 'asc',
        },
      });
      client.emit('initialMessages', messages);
    } catch (error) {
      console.error('Error retrieving initial messages:', error);
    }*/
  }

  @SubscribeMessage('getFriends')
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
  }

  @SubscribeMessage('addFriend')
  async addFriend(client: SocketWithAuth, friendDto: FriendDto) {
    await this.friendService.addFriend(client.userID, friendDto.friend_id);
  }

  @SubscribeMessage('removeFriend')
  async removeFriend(client: SocketWithAuth, friendDto: FriendDto) {
    await this.friendService.removeFriend(client.userID, friendDto.friend_id);
  }

  @SubscribeMessage('createChannel')
  async createChannel(client: SocketWithAuth, channelDto: CreateChannelDto) {
    console.log('criando canal');
    await this.channelService.create(channelDto, client.userID);
  }
  @SubscribeMessage('createDirect')
  async createDirect(client: SocketWithAuth, channelDto: CreateChannelDto) {
    console.log('criando canal');
    await this.channelService.createDirect(channelDto, client.userID);
  }



  @SubscribeMessage('addMember')
  async addMember(client: SocketWithAuth, memberDto: MemberDto) {
    if (
      !Object.values(ChannelMemberStatus).includes(
        memberDto.status as ChannelMemberStatus,
      )
    ) {
      throw new Error('Invalid member status');
    }
    await this.channelService.addMember(memberDto, client.userID);
  }

  @SubscribeMessage('changeMemberStatus')
  async changeMemberStatus(client: SocketWithAuth, memberDto: MemberDto) {
    await this.channelService.changeMemberStatus(memberDto, client.userID);
  }

  @SubscribeMessage('removeMember')
  async removeMember(client: SocketWithAuth, removeMemberDto: RemoveMemberDto) {
    await this.channelService.removeMember(removeMemberDto, client.userID);
  }

  @SubscribeMessage('leaveChannel')
  async leaveChannel(client: SocketWithAuth, leaveDto: LeaveDto) {
    console.log('vamos deixar o canal');
    await this.channelService.leaveChannel(leaveDto, client.userID);
  }

  @SubscribeMessage('joinChannel')
  async joinChannel(client: SocketWithAuth, channelDto: ChannelDto) {
    await this.channelService.joinChannel(channelDto, client.userID);
  }

  @SubscribeMessage('changePassword')
  async changePassword(client: SocketWithAuth, channelDto: ChannelDto) {
    await this.channelService.changePassword(channelDto, client.userID);
  }

  @SubscribeMessage('blockUser')
  async blockUser(client: SocketWithAuth, blockUser: BlockUserDto) {
    blockUser.user_id = client.userID;
    await this.usersService.blockUser(blockUser);
  }

  @SubscribeMessage('UnBlockUser')
  async unBlockUser(client: SocketWithAuth, blockUser: BlockUserDto) {
    blockUser.user_id = client.userID;
    await this.usersService.unBlockUser(blockUser);
  }


}
