import { Injectable } from '@nestjs/common';
import { ChatRepository } from './repository/chat.repository';
import { ChatDto } from './dto/chat.dto';

@Injectable()
export class ChatService {
  constructor(private readonly repository: ChatRepository) {}

  async saveMessage(chatDto: ChatDto): Promise<ChatDto> {
    // primeiro verifica se o user pode mandar msg no canal
    // primeiro verifica se usuário faz parte desse canal
    return await this.repository.saveMessage(chatDto);
    // vai me devolver uma lista com os usuários desse canal
  }

  async getChatMessage(chanel_id: number): Promise<any> {
    // primeiro verifica se usuário faz parte desse canal
    return this.repository.getChatMessage(chanel_id);
  }
}
