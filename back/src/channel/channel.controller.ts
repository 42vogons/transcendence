import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Delete,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { MemberDto } from './dto/member.dto';
import { ChannelDto } from './dto/channel.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { LeaveDto } from './dto/leave.dto';
import { RemoveMemberDto } from './dto/removeMember.dto copy';
import { AuthGuard } from 'src/login/auth.guard';

@UseGuards(AuthGuard)
@Controller('channel')
export class ChannelController {
  jwtService: any;
  constructor(private readonly channelService: ChannelService) {}

  @Post('/create-channel')
  create(@Req() request, @Body() createChatDto: CreateChannelDto) {
    return this.channelService.create(createChatDto, request.user.id);
  }

  @Post('/addMember')
  addMember(@Req() request, @Body() member: MemberDto) {
    return this.channelService.addMember(
      member.user_id,
      member.channel_id,
      member.status,
      request.user.id,
    );
  }

  @Delete('/removeMember')
  removeMember(@Req() request, @Body() member: RemoveMemberDto) {
    return this.channelService.removeMember(
      member.member_id,
      member.channel_id,
      request.user.id,
    );
  }
  @Patch('/changeMemberStatus')
  changeMemberStatus(@Req() request, @Body() member: MemberDto) {
    return this.channelService.changeMemberStatus(
      member.user_id,
      member.channel_id,
      member.status,
      request.user.id,
    );
  }

  @Get('/channelsByUser')
  listChannelsByUser(@Req() request) {
    return this.channelService.listChannelsByUser(request.user.id);
  }

  @Post('/leave')
  leaveChannel(@Req() request, @Body() channel: LeaveDto) {
    return this.channelService.leaveChannel(
      channel.channel_id,
      request.user.id,
    );
  }

  @Get('/channels')
  listChannels() {
    return this.channelService.listAllChannels();
  }

  @Post('/enterChannel')
  enterChannel(@Req() request, @Body() channel: ChannelDto) {
    return this.channelService.enterChannel(
      channel.channel_id,
      channel.password,
      request.user.id,
    );
  }

  @Patch('/changePassword')
  async changePassword(@Req() request, @Body() channel: ChannelDto) {
    return await this.channelService.changePassword(
      channel.channel_id,
      channel.password,
      request.user.id,
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