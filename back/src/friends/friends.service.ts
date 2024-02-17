import { Injectable, NotFoundException } from '@nestjs/common';
import { FriendsRepository } from './repositories/friends.repository';
import { friends } from '@prisma/client';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FriendsService {
  constructor(
    private readonly repository: FriendsRepository,
    private readonly userService: UsersService,
  ) {}
  async addFriend(userId: any, friendId: number): Promise<friends> {
    const friendExists = await this.userService.findOne(friendId);
    if (friendExists) {
      return this.repository.addFriend(userId, friendId);
    }
    throw new NotFoundException('User not found');
  }

  async removeFriend(userId: any, friendId: number): Promise<any> {
    return this.repository.removeFriend(userId, friendId);
  }
}
