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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';
import { AuthGuard } from 'src/login/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs');

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

  /*@Get()
  findAll() {
    return this.usersService.findAll();
  }*/

  /*@Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }*/

  @Patch()
  @UseGuards(AuthGuard)
  async update(@Req() request, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.findByToken(request.user.id);
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

  // @Post('/avatar')
  // @UseGuards(AuthGuard)
  // @UseInterceptors(FileInterceptor('avatar'))
  // async uploadAvatar(
  //   @UploadedFile() file: Express.Multer.File,
  //   @Req() request,
  // ) {
  //   const user = await this.usersService.findByToken(request.user.id);
  //   const avatarUrl = `/uploads/avatars/${file.originalname}`;
  //   user.avatar_url = avatarUrl;
  //   await this.usersService.update(user.user_id, user);
  //   return { avatarUrl };
  // }

  @Post('upload-avatar')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: (request, file, callback) => {
          const path = `./uploads/avatar`;
          fs.mkdirSync(path, { recursive: true });
          callback(null, path);
        },
        filename(_, file, callback) {
          return callback(null, `${file.originalname}`);
        },
      }),
    }),
  )
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
    const user = await this.usersService.findByToken(request.user.id);
    const avatarUrl = `/uploads/avatar/${userId}/${file.originalname}`;
    user.avatar_url = avatarUrl;
    await this.usersService.update(user.user_id, user);
    return {
      url: process.env.BACK_HOST + avatarUrl,
    };
  }

  @Get('/avatar/:userId')
  async getAvatarUrl(@Param('userId') userId: number) {
    const user = await this.usersService.findOne(userId);
    if (!user || !user.avatar_url) {
      throw new Error('Avatar não encontrado');
    }
    return { avatarUrl: user.avatar_url };
  }
}
