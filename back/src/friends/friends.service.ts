import { Injectable } from '@nestjs/common';
import { FriendsRepository } from './repositories/friends.repository';
import { friends } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class FriendsService {
  constructor(
    private readonly repository: FriendsRepository,
    private readonly jwtService: JwtService,
  ) {}

  async addFriend(token: string, friendId: number): Promise<friends> {
    const decodeToken = this.jwtService.decode(token);
    return this.repository.addFriend(decodeToken.id, friendId);
  }

  async removeFriend(token: string, friendId: number): Promise<any> {
    const decodeToken = this.jwtService.decode(token);
    return this.repository.removeFriend(decodeToken.id, friendId);
  }
}
