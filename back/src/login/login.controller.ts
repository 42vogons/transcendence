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
    const profile = await this.loginService.getToken(body.code, res);

    try {
      if (profile) {
        res.status(200).send('{ "action":"logged"');
        console.log('logado');
      } else {
        res.status(200).send('{ "action":"authenticate"}');
        console.log('authenticate');
      }
    } catch (error) {
      console.error('Erro ao obter token:', error.message);
      return res.status(500).send({ error: 'Erro ao obter token' });
    }
  }

  @Post('/checkTwoFactor')
  @HttpCode(200)
  async checkTwoFactor(@Req() request, @Body() body: any, @Response() res) {
    const token = request.cookies.accessToken;
    const valid = await this.loginService.checkTwoFactor(token, body.code);
    if (valid) res.status(200).send('{ "action":"logged"');
    else res.status(401).send('{ "action":"authenticate-fail"}');
  }
}
