import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserEntity } from '../entities/user.entity';

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

  async findOne(user_id: number): Promise<UserEntity> {
    return this.prisma.users.findUnique({
      where: {
        user_id: user_id,
      },
    });
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

  async findFriends(userId: number): Promise<any> {
    return this.prisma.users.findMany({
      where: {
        user_id: userId,
      },
      include: {
        friends_friends_friend_idTousers: true,
      },
    });
  }
}
