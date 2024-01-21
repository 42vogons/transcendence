import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { FriendsEntity } from '../entities/friends.entity';

@Injectable()
export class FriendsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async addFriend(userId: number, friendId: number): Promise<FriendsEntity> {
    return this.prisma.friends.create({
      data: {
        user_id: userId,
        friend_id: friendId,
      },
    });
  }
}