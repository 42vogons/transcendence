import {
  Controller,
  Post,
  Body,
  Req,
  Get,
  Patch,
  UseGuards,
  BadRequestException,
  Logger,
  Param,
} from '@nestjs/common';
import { ChannelService } from './channel.service';
import { MemberDto } from './dto/member.dto';
import { ChannelDto } from './dto/channel.dto';
import { CreateChannelDto } from './dto/create-channel.dto';
import { LeaveDto } from './dto/leave.dto';
import { AuthGuard } from 'src/login/auth.guard';
import { UpdateChannelDto } from './dto/update-channel.dto';

@UseGuards(AuthGuard)
@Controller('channel')
export class ChannelController {
  jwtService: any;
  constructor(private readonly channelService: ChannelService) {}
  private logger: Logger = new Logger('AppGateway');

  @Post('/create-channel')
  async create(@Req() request, @Body() createChatDto: CreateChannelDto) {
    try {
      const channel_id = await this.channelService.create(
        createChatDto,
        request.user.id,
      );
      this.logger.log(`Channel created by id ${channel_id}.`);
    } catch (error) {
      this.logger.error(error.response.message);
      throw new BadRequestException(error.response);
    }
  }

  @Patch('/:channelId')
  updateChannel(
    @Req() request,
    @Body() channel: UpdateChannelDto,
    @Param('channelId') channelId: number,
  ) {
    return this.channelService.updateChannel(
      channel,
      request.user.id,
      channelId,
    );
  }

  @Post('/addMember')
  addMember(@Req() request, @Body() member: MemberDto) {
    return this.channelService.addMember(member, request.user.id);
  }

  @Patch('/changeMemberStatus')
  changeMemberStatus(@Req() request, @Body() member: MemberDto) {
    return this.channelService.changeMemberStatus(member, request.user.id);
  }

  @Get('/channelsByUser')
  listChannelsByUser(@Req() request) {
    return this.channelService.listChannelsByUser(request.user.id);
  }

  @Post('/leave')
  leaveChannel(@Req() request, @Body() channel: LeaveDto) {
    return this.channelService.leaveChannel(channel, request.user.id);
  }

  @Get('/channels')
  listChannels(@Req() request) {
    return this.channelService.listAllChannels(request.user.id);
  }

  @Post('/joinChannel')
  async joinChannel(@Req() request, @Body() channel: ChannelDto) {
    try {
      await this.channelService.joinChannel(channel, request.user.id);
      this.logger.log(`Joined on changed ${channel.channel_id}.`);
    } catch (error) {
      this.logger.error(error.response.message);
      throw new BadRequestException(error.response);
    }
  }

  @Patch('/changePassword')
  async changePassword(@Req() request, @Body() channel: ChannelDto) {
    console.log('channel:', channel);
    try {
      await this.channelService.changePassword(channel, request.user.id);
      this.logger.log(`Password was changed ${channel.channel_id}.`);
    } catch (error) {
      this.logger.error(error.response.message);
      throw new BadRequestException(error.response);
    }
  }
}
