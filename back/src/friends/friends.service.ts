import { Injectable } from '@nestjs/common';
import { FriendsRepository } from './repositories/friends.repository';
import { friends } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(private readonly repository: FriendsRepository) {}

  async addFriend(userId: any, friendId: number): Promise<friends> {
    return this.repository.addFriend(userId, friendId);
  }

  async removeFriend(userId: any, friendId: number): Promise<any> {
    return this.repository.removeFriend(userId, friendId);
  }
}
