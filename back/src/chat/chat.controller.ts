import { Controller, Post, Body, Req } from '@nestjs/common';
import { ChatService } from './chat.service';
import { MemberDto } from './dto/member.dto';
import { CreateChatDto } from './dto/create-chat.dto copy';

@Controller('chat')
export class ChatController {
  jwtService: any;
  constructor(private readonly chatService: ChatService) {}

  @Post('/create-channel')
  create(@Req() request, @Body() createChatDto: CreateChatDto) {
    const token = request.cookies.accessToken;
    return this.chatService.create(createChatDto, token);
  }

  @Post('/addMember')
  addMember(@Req() request, @Body() member: MemberDto) {
    const token = request.cookies.accessToken;
    return this.chatService.addMember(
      member.user_id,
      member.channel_id,
      member.status,
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
