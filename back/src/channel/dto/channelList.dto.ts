import { channel_members } from '@prisma/client';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class channel_listDTO {
  @IsNotEmpty()
  @IsString()
  lastMessage: string;

  @IsNotEmpty()
  @IsString()
  channelName: string;

  @IsNotEmpty()
  @IsString()
  userName: string;

  @IsNotEmpty()
  @IsNumber()
  channelId: number;

  @IsNotEmpty()
  @IsString()
  type: string;
  timestamp: any;

  channelMembers: channel_members[];

  constructor(
    lastMessage: string,
    channelName: string,
    userName: string,
    channelId: number,
    type: string,
    channelMembers: channel_members[],
  ) {
    this.lastMessage = lastMessage;
    this.channelName = channelName;
    this.userName = userName;
    this.channelId = channelId;
    this.channelMembers = channelMembers;
    this.type = type;
  }
}
