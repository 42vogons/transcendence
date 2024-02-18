import { PrismaService } from 'src/prisma/prisma.service';
import { FriendsEntity } from '../entities/friends.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FriendsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addFriend(userId: number, friendId: number): Promise<FriendsEntity> {
    return this.prisma.friends.create({
      data: {
        user_id: userId > friendId ? userId : friendId,
        friend_id: userId < friendId ? userId : friendId,
      },
    });
  }

  async removeFriend(userId: number, friendId: number) {
    return await this.prisma.friends.delete({
      where: {
        user_id_friend_id: {
          user_id: userId > friendId ? userId : friendId,
          friend_id: userId < friendId ? userId : friendId,
        },
      },
    });
  }
}
