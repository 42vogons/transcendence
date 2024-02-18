import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { JwtService } from '@nestjs/jwt';

import { NotFoundError } from '../common/errors/types/NotFoundError';
import { UserEntity } from './entities/user.entity';
import { BlockUserDto } from './dto/blockUser.dto';

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly jwtService: JwtService,
  ) {}

  createNewUser(profile: any) {
    const newUser: CreateUserDto = new CreateUserDto();
    newUser.username = profile.login;
    newUser.email = profile.email;
    newUser.two_factor_enabled = false;
    newUser.user_id_42 = profile.id;
    this.repository.create(newUser);
    Logger.log(`New user created: ${newUser}.`);
  }

  async create(createUserDto: CreateUserDto) {
    return await this.repository.create(createUserDto);
  }

  async findAll() {
    return await this.repository.findAll();
  }

  async findByToken(userId: any) {
    return await this.findOne(userId);
  }

  async findOne(user_id: number): Promise<UserEntity> {
    const user = await this.repository.findOne(user_id);
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    return user;
  }

  async findEmail(user_email: string): Promise<UserEntity> {
    const user = await this.repository.findEmail(user_email);
    if (!user) {
      throw new NotFoundError('User not found.');
    }
    return user;
  }

  async update(user_id: number, updateUserDto: UpdateUserDto) {
    return await this.repository.update(user_id, updateUserDto);
  }

  async remove(user_id: number) {
    return await this.repository.remove(user_id);
  }

  async findFriends(userId: any): Promise<Friends[] | null> {
    return await this.repository.findFriends(userId);
  }

  async setStatus(userId: any, status: string) {
    return await this.repository.setStatus(userId, status);
  }

  async blockUser(blockUser: BlockUserDto) {
    return await this.repository.blockUser(blockUser);
  }

  async unBlockUser(blockUser: BlockUserDto) {
    return await this.repository.unBlockUser(blockUser);
  }

  async checkBlockedStatus(blockUser: BlockUserDto) {
    return await this.repository.checkBlockStatus(blockUser);
  }
}
