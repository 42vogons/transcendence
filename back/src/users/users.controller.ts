import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Response,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';

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
  async findFriend(@Req() request) {
    return this.usersService.findFriends(request.cookies.accessToken);
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Post('/activeTwoFactor')
  async activeTwoFactor(@Req() request, @Response() response) {
    const token = request.cookies.accessToken;
    const user = await this.usersService.findByToken(token);
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
