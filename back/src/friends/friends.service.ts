import { Injectable } from '@nestjs/common';
import { FriendsRepository } from './repositories/friends.repository';
import { CreateFriendDto } from './dto/create-friend.dto';
import { friends } from '@prisma/client';

@Injectable()
export class FriendsService {
  constructor(private readonly repository: FriendsRepository) {}

  async addFriend(dto: CreateFriendDto): Promise<friends> {
    return this.repository.addFriend(dto.userId, dto.friendId);
  }
}
