import {
  BadRequestException,
  Body,
  Injectable,
  Logger,
  Response,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

import { NotFoundError } from '../common/errors/types/NotFoundError';
import { UserEntity } from './entities/user.entity';
import { BlockUserDto } from './dto/blockUser.dto';
import { ProfileDto } from './dto/profile.dto';
import { TwoFactorAutenticateService } from 'src/two-factor-autenticate/two-factor-autenticate.service';
import { z } from 'zod';
import { LoginService } from 'src/login/login.service';

const UpdateUserSchema = z.object({
  username: z
    .string()
    .length(8, { message: 'Username must be exactly 8 characters long' })
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: 'Username must contain only letters, numbers or hyphen',
    }),
});

@Injectable()
export class UsersService {
  constructor(
    private readonly repository: UsersRepository,
    private readonly twoFactorAutenticateService: TwoFactorAutenticateService,
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

  async activeTwoFactor(user_id: number) {
    const user = await this.findOne(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.two_factor_enabled) {
      user.two_factor_enabled = !user.two_factor_enabled;
      await this.update(user.user_id, user);
      return { enabled: false };
    }

    const { secret, otpauthUrl } =
      await this.twoFactorAutenticateService.generateSecret(user.email);
    user.token_secret = secret;
    await this.update(user.user_id, user);
    return { enabled: true, otpauthUrl };
  }

  async firstActiveTwoFactor(user_id: number, code: string): Promise<boolean> {
    const user = await this.findOne(user_id);
    if (!user) {
      throw new Error('User not found');
    }
    const valid =
      this.twoFactorAutenticateService.isTwoFactorAuthenticationCodeValid(
        code,
        user.token_secret,
      );
    if (valid) {
      user.two_factor_enabled = !user.two_factor_enabled;
      await this.update(user.user_id, user);
      return true;
    }
    return false;
  }

  async updateUser(
    user_id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Response() res,
  ) {
    const user = await this.findOne(user_id);
    try {
      UpdateUserSchema.parse(updateUserDto);
    } catch (error) {
      Logger.error(`400 Error to update user: ${error.errors[0]?.message}`);
      throw new BadRequestException(error.errors);
    }
    await this.update(user.user_id, updateUserDto);
    return res;
    //await this.loginService.insertToken(updatedUser, res, 'logged');
  }
}
