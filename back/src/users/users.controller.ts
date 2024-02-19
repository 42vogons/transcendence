import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Req,
  Response,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';
import { AuthGuard } from 'src/login/auth.guard';

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

  @Get('/findByUser')
  async findByUserName(@Req() request) {
    return this.usersService.findUserByUserName(request.user_name);
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
}
