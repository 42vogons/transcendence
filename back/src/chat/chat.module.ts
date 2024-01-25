import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [ChatController],
  providers: [ChatService, JwtService],
})
export class ChatModule {}
