import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Delete,
  Patch,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { MemberDto } from './dto/member.dto';
import { ChannelDto } from './dto/channel.dto';
import { CreateChannelDto } from './dto/create-channel.dto';

@Controller('channel')
export class ChannelController {
  jwtService: any;
  constructor(private readonly channelService: ChannelService) {}

  @Post('/create-channel')
  create(@Req() request, @Body() createChatDto: CreateChannelDto) {
    const token = request.cookies.accessToken;
    return this.channelService.create(createChatDto, token);
  }

  @Post('/addMember')
  addMember(@Req() request, @Body() member: MemberDto) {
    const token = request.cookies.accessToken;
    return this.channelService.addMember(
      member.user_id,
      member.channel_id,
      member.status,
      token,
    );
  }

  @Delete('/removeMember')
  removeMember(@Req() request, @Body() member: MemberDto) {
    const token = request.cookies.accessToken;
    return this.channelService.removeMember(
      member.user_id,
      member.channel_id,
      token,
    );
  }
  @Patch('/changeMemberStatus')
  changeMemberStatus(@Req() request, @Body() member: MemberDto) {
    const token = request.cookies.accessToken;
    return this.channelService.changeMemberStatus(
      member.user_id,
      member.channel_id,
      member.status,
      token,
    );
  }

  @Get('/channelsByUser')
  listChannelsByUser(@Req() request) {
    const token = request.cookies.accessToken;
    return this.channelService.listChannelsByUser(token);
  }

  @Post('/leave')
  leaveChannel(@Req() request, @Body() channel: ChannelDto) {
    const token = request.cookies.accessToken;
    return this.channelService.leaveChannel(channel.channel_id, token);
  }

  @Get('/channels')
  listChannels() {
    return this.channelService.listAllChannels();
  }

  @Post('/enterChannel')
  enterChannel(@Req() request, @Body() channel: ChannelDto) {
    const token = request.cookies.accessToken;
    return this.channelService.enterChannel(
      channel.channel_id,
      channel.password,
      token,
    );
  }

  @Patch('/changePassword')
  async changePassword(@Req() request, @Body() channel: ChannelDto) {
    const token = request.cookies.accessToken;
    return await this.channelService.changePassword(
      channel.channel_id,
      channel.password,
      token,
    );
  }

  /*@Get()
  findAll() {
    return this.chatService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatService.update(+id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(+id);
  }*/
}
