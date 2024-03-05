import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { JwtService } from '@nestjs/jwt';

import { NotFoundError } from '../common/errors/types/NotFoundError';
import { UserEntity } from './entities/user.entity';
import { BlockUserDto } from './dto/blockUser.dto';
import { ProfileDto } from './dto/profile.dto';

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

  async findUsernameByUserID(user_id: number): Promise<string> {
    const username = await this.repository.findUsernameByUserID(user_id);
    if (!username) {
      throw new NotFoundError('User not found.');
    }
    return username;
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
    const isBlocked = await this.checkBlockedStatus(blockUser);
    if (isBlocked) {
      throw new BadRequestException('This user already blocked');
    }
    const isUser = await this.findOne(blockUser.member_id);
    if (!isUser) {
      throw new BadRequestException('Invalid member');
    }
    return await this.repository.blockUser(blockUser);
  }

  async unBlockUser(blockUser: BlockUserDto) {
    return await this.repository.unBlockUser(blockUser);
  }

  async checkBlockedStatus(blockUser: BlockUserDto) {
    return await this.repository.checkBlockStatus(blockUser);
  }

  async findUsersByPartOfUserName(user_name: string) {
    return (await this.repository.findUsersByPartOfUserName(user_name)).map(
      user => this.mapToProfileDTO(user),
    );
  }

  public mapToProfileDTO(user: UserEntity): Partial<ProfileDto> {
    const userDTO: Partial<ProfileDto> = {
      user_id: user.user_id,
      avatar_url: user.avatar_url,
      username: user.username,
      total_wins: user.total_wins,
      total_losses: user.total_losses,
      total_games: user.total_games,
    };
    return userDTO;
  }

  async uploadAvatar(userId: number, file: Express.Multer.File): Promise<void> {
    try {
      const imagePath = `/uploads/${file.originalname}`;
      await this.repository.updateAvatarUrl(userId, imagePath);
      Logger.log(`Avatar uploaded for user ${userId}.`);
    } catch (error) {
      Logger.error(
        `Failed to upload avatar for user ${userId}: ${error.message}`,
      );
      throw new Error('Failed to upload avatar.');
    }
  }
}
