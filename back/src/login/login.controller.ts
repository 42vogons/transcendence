import {
  Controller,
  Body,
  Post,
  HttpCode,
  Response,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { LoginService } from './login.service';

@Controller('')
export class LoginController {
  constructor(private readonly loginService: LoginService) {}

  @Post('/auth/user')
  @HttpCode(200)
  async getToken(@Body() body: any, @Response() res): Promise<Response> {
    try {
      return await this.loginService.login(body, res);
    } catch (Error) {
      throw new UnauthorizedException('Fail to access intra');
    }
  }

  @Post('/checkTwoFactor')
  @HttpCode(200)
  async checkTwoFactor(@Req() request, @Body() body: any, @Response() res) {
    return await this.loginService.checkTwoFactor(
      request.cookies.accessToken,
      body.code,
      res,
    );
  }

  @Post('/logout')
  async logout(@Response() res) {
    res.clearCookie('accessToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
