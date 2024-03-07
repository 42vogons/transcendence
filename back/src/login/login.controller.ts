import {
  Controller,
  Body,
  Post,
  HttpCode,
  Response,
  Req,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';

@Controller('')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly twoFactorService: TwoFactorAutenticateService,
  ) {}

  @Post('/auth/user')
  @HttpCode(200)
  async getToken(@Body() body: any, @Response() res): Promise<Response> {
    return await this.loginService.login(body, res);
  }

  @Post('/checkTwoFactor')
  @HttpCode(200)
  async checkTwoFactor(@Req() request, @Body() body: any, @Response() res) {
    console.log(request.cookies.accessToken);
    const valid = await this.loginService.checkTwoFactor(
      request.cookies.accessToken,
      body.code,
      res,
    );
    console.log('valid?' + valid);
    if (valid) res.status(200).send('{"action":"logged"}');
    else res.status(401).send('{"action":"authenticate-fail"}');
  }

  @Post('/logout')
  async logout(@Response() res) {
    res.clearCookie('accessToken');
    return res.status(200).json({ message: 'Logged out successfully' });
  }
}
