import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Response,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  Param,
  MaxFileSizeValidator,
  FileTypeValidator,
  ParseFilePipe,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';
import { AuthGuard } from 'src/login/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { z } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

const UpdateUserSchema = z.object({
  username: z
    .string()
    .length(8, { message: 'Username must be exactly 8 characters long' })
    .regex(/^\w+$/, {
      message: 'Username must not contain spaces or special characters',
    }),
});

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly twoFactorAutenticateService: TwoFactorAutenticateService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('/friends')
  @UseGuards(AuthGuard)
  async findFriend(@Req() request) {
    return this.usersService.findFriends(request.user.id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async update(@Req() request, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findByToken(request.user.id);
    try {
      UpdateUserSchema.parse(updateUserDto);
    } catch (error) {
      Logger.error(`400 Error to update user: ${error.errors[0]?.message}`);
      throw new BadRequestException(error.errors);
    }
    return this.usersService.update(user.user_id, updateUserDto);
  }

  @Post('/findUsersByPartOfUserName')
  async findUsersByPartOfUserName(@Body() body) {
    return this.usersService.findUsersByPartOfUserName(body.user_name);
  }

  @Post('/activeTwoFactor')
  @UseGuards(AuthGuard)
  async activeTwoFactor(@Req() request, @Response() response) {
    const user = await this.usersService.findByToken(request.user.id);
    user.two_factor_enabled = user.two_factor_enabled ? false : true;
    if (user.two_factor_enabled) {
      const { secret, otpauthUrl } =
        await this.twoFactorAutenticateService.generateSecret(user.email);
      user.token_secret = secret;
      this.usersService.update(user.user_id, user);
      return this.twoFactorAutenticateService.pipeQrCodeStream(
        response,
        otpauthUrl,
      );
    }
    this.usersService.update(user.user_id, user);
    return response.status(200).send();
  }

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  async uploadAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1000000 }),
          new FileTypeValidator({ fileType: '(jpeg|jpg|png)$' }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() request,
  ) {
    const userId = request.user.id;
    console.log(userId);
    const path = `./uploads/avatar/${userId}`;
    try {
      await fs.promises.mkdir(path, { recursive: true });
    } catch (error) {
      throw new Error('Failed to create directory');
    }
    const imagePath = `${path}/${file.originalname}`;
    try {
      await fs.promises.writeFile(imagePath, file.buffer);
    } catch (error) {
      throw new Error('Failed to save image');
    }
    const avatarUrl =
      process.env.BACK_HOST + `/uploads/avatar/${userId}/${file.originalname}`;
    const user = await this.usersService.findByToken(request.user.id);
    user.avatar_url = avatarUrl;
    await this.usersService.update(userId, user);
    return {
      url: avatarUrl,
    };
  }

  @Get('/avatar/:userId')
  @UseGuards(AuthGuard)
  async getAvatarUrl(@Param('userId') userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.avatar_url) {
      throw new Error('Avatar não encontrado');
    }
    return { avatarUrl: user.avatar_url };
  }

  @Get('/findUsersByUserID/:userId')
  async findUsersByUserID(@Param('userId') userId: number) {
    return this.usersService
      .findOne(userId)
      .then(user => this.usersService.mapToProfileDTO(user));
  }
}
