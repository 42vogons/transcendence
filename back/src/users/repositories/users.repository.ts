import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';
import { UpdateUserGameStatisticDto } from '../dto/update-user-game-statistic';
import { BlockUserDto } from '../dto/blockUser.dto';

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto): Promise<UserEntity> {
    return this.prisma.users.create({
      data: createUserDto,
    });
  }

  async findAll(): Promise<UserEntity[]> {
    return this.prisma.users.findMany();
  }

  async findEmail(user_email: string): Promise<UserEntity> {
    return this.prisma.users.findUnique({
      where: {
        email: user_email,
      },
    });
  }

  async findOne(user_id: number): Promise<UserEntity | null> {
    return this.prisma.users.findUnique({
      where: {
        user_id: user_id,
      },
    });
  }

  async findByUserName(userName: string): Promise<number | null> {
    const user = await this.prisma.users.findFirst({
      where: {
        username: userName,
      },
    });
    return user ? user.user_id : null;
  }

  async update(
    user_id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<UserEntity> {
    return this.prisma.users.update({
      where: {
        user_id: user_id,
      },
      data: updateUserDto,
    });
  }

  async remove(user_id: number): Promise<UserEntity> {
    return this.prisma.users.delete({
      where: {
        user_id: user_id,
      },
    });
  }

  async findFriends(userId: number): Promise<Friends[]> {
    const userWithFriends = await this.prisma.users.findUnique({
      where: {
        user_id: userId,
      },
      include: {
        friends_friends_user_idTousers: {
          select: {
            users_friends_friend_idTousers: {
              select: {
                user_id: true,
                username: true,
                avatar_url: true,
              },
            },
          },
        },
        friends_friends_friend_idTousers: {
          select: {
            users_friends_user_idTousers: {
              select: {
                user_id: true,
                username: true,
                avatar_url: true,
              },
            },
          },
        },
      },
    });
    if (!userWithFriends) {
      return [];
    }
    const friendsList = [
      ...userWithFriends.friends_friends_user_idTousers.map(
        f => f.users_friends_friend_idTousers,
      ),
      ...userWithFriends.friends_friends_friend_idTousers.map(
        f => f.users_friends_user_idTousers,
      ),
    ];
    const uniqueFriendIds = new Set(friendsList.map(friend => friend.user_id));
    const uniqueFriends = Array.from(uniqueFriendIds).map(id => {
      const friend = friendsList.find(friend => friend.user_id === id);
      return {
        user_id: id,
        username: friend.username,
        avatar_url: friend.avatar_url,
      };
    });
    return uniqueFriends;
  }

  async setStatus(userId: number, status: string) {
    return await this.prisma.users.update({
      where: { user_id: userId },
      data: { status: status },
    });
  }

  async updateUserGameStatistic(
    user_id: number,
    updateUserGameStatisticDto: UpdateUserGameStatisticDto,
  ): Promise<UserEntity> {
    return this.prisma.users.update({
      where: {
        user_id: user_id,
      },
      data: updateUserGameStatisticDto,
    });
  }

  async blockUser(blockUser: BlockUserDto) {
    return await this.prisma.blocklist.create({
      data: {
        userId: blockUser.user_id,
        memberId: blockUser.member_id,
        blockedAt: new Date(),
      },
    });
  }

  async unBlockUser(blockUser: BlockUserDto) {
    return await this.prisma.blocklist.deleteMany({
      where: {
        userId: blockUser.user_id,
        memberId: blockUser.member_id,
      },
    });
  }

  async checkBlockStatus(blockUser: BlockUserDto): Promise<Date | null> {
    const blockEntry = await this.prisma.blocklist.findFirst({
      where: {
        userId: blockUser.user_id,
        memberId: blockUser.member_id,
      },
    });

    return blockEntry ? blockEntry.blockedAt : null;
  }
}
