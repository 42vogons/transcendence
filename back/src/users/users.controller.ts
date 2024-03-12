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
    .regex(/^[a-zA-Z0-9-]+$/, {
      message: 'Username must contain only letters, numbers or hyphen',
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

  @Get('/me')
  @UseGuards(AuthGuard)
  async findMe(@Req() request) {
    const user = await this.usersService.findOne(request.user.id);
    const myUser = {
      user_id: user.user_id,
      username: user.username,
      avatar_url: user.avatar_url,
      two_factor_enabled: user.two_factor_enabled,
    };
    return myUser;
  }

  @Get('/friends')
  @UseGuards(AuthGuard)
  async findFriend(@Req() request) {
    return this.usersService.findFriends(request.user.id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async update(
    @Req() request,
    @Body() updateUserDto: UpdateUserDto,
    @Response() res,
  ) {
    try {
      UpdateUserSchema.parse(updateUserDto);
      this.usersService.updateUser(request.user.id, updateUserDto, res);
    } catch (error) {
      Logger.error(`400 Error to update user: ${error.errors[0]?.message}`);
      throw new BadRequestException(error.errors);
    }


    /*
    const user = await this.usersService.findOne(request.user.id);
    try {
      UpdateUserSchema.parse(updateUserDto);
    } catch (error) {
      Logger.error(`400 Error to update user: ${error.errors[0]?.message}`);
      throw new BadRequestException(error.errors);
    }
    return this.usersService.update(user.user_id, updateUserDto);*/
  }

  @UseGuards(AuthGuard)
  @Post('/findUsersByPartOfUserName')
  async findUsersByPartOfUserName(@Body() body) {
    return this.usersService.findUsersByPartOfUserName(body.user_name);
  }

  @UseGuards(AuthGuard)
  @Post('/activeTwoFactor')
  async activeTwoFactor(@Req() request, @Response() response) {
    const result = await this.usersService.activeTwoFactor(request.user.id);
    if (result.enabled && result.otpauthUrl) {
      return this.twoFactorAutenticateService.pipeQrCodeStream(
        response,
        result.otpauthUrl,
      );
    } else if (result.enabled) {
      response
        .status(400)
        .send(
          'Failed to generate QR Code for 2FA. Please retry or check your 2FA setup.',
        );
    } else {
      return response.status(200).send('2FA successfully disabled.');
    }
  }

  @UseGuards(AuthGuard)
  @Post('/firstActiveTwoFactor')
  async firstActiveTwoFactor(@Req() request, @Body() body, @Response() res) {
    const result = await this.usersService.firstActiveTwoFactor(
      request.user.id,
      body.code,
    );
    if (result) {
      return res.status(200).send('Actived');
    }
    return res.status(400).send('Fail');
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
    const user = await this.usersService.findOne(request.user.id);
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
  @UseGuards(AuthGuard)
  async findUsersByUserID(@Param('userId') userId: number) {
    return this.usersService
      .findOne(userId)
      .then(user => this.usersService.mapToProfileDTO(user));
  }

  @Get('/findUsernameByUserID/:userId')
  @UseGuards(AuthGuard)
  async findUsernameByUserID(@Param('userId') userId: number) {
    const username = await this.usersService.findUsernameByUserID(userId);
    return { username: username };
  }
}
