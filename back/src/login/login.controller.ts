import {
  Controller,
  Body,
  Post,
  HttpCode,
  Response,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginService } from './login.service';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';
import { AuthGuard } from './auth.guard';

@Controller('')
export class LoginController {
  constructor(
    private readonly loginService: LoginService,
    private readonly twoFactorService: TwoFactorAutenticateService,
  ) {}

  @Post('check')
  async checkCode(@Body() body: any) {
    const token = body.token;
    const secret = body.secret;
    const isValid =
      await this.twoFactorService.isTwoFactorAuthenticationCodeValid(
        token,
        secret,
      );
    console.info('Is Valid' + isValid);
  }

  @Post('/auth/user')
  @HttpCode(200)
  async getToken(@Body() body: any, @Response() res): Promise<Response> {
    return await this.loginService.login(body, res);
  }

  @UseGuards(AuthGuard)
  @Post('/checkTwoFactor')
  @HttpCode(200)
  async checkTwoFactor(@Req() request, @Body() body: any, @Response() res) {
    const valid = await this.loginService.checkTwoFactor(
      request.user.id,
      body.code,
    );
    if (valid) res.status(200).send('{"action":"logged"}');
    else res.status(401).send('{"action":"authenticate-fail"}');
  }
}
