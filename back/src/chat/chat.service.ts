import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class ChatService {
  constructor(
    //private readonly repository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  create(createChatDto: CreateChatDto, token: any) {
    const decodeToken = this.jwtService.decode(token);
    console.log('user_id ' + decodeToken.id);
    return 'This action adds a new chat';
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
