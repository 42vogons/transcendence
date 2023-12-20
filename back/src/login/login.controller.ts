import { Controller, Body, Post, HttpCode, Query, Response   } from '@nestjs/common';
import { LoginService } from './login.service';
import { TwoFactorAutenticateService } from './two-factor-autenticate/two-factor-autenticate.service';
import { ClassSerializerInterceptor, Header, UseInterceptors, Res, UseGuards, Req } from '@nestjs/common';


@Controller('')
export class LoginController {
    constructor(
      private readonly loginService: LoginService, 
      private readonly twoFactorService: TwoFactorAutenticateService,
      ) {}


    @Post('generate')
    async register(@Res() response: Response) {
      const { otpauthUrl } = await this.twoFactorService.generateSecret();
      return this.twoFactorService.pipeQrCodeStream(response, otpauthUrl);
    }

    @Post('check')
    async checkCode(@Body() body: any){
      const token = body.token;
      const secret = body.secret;
      const isValid = await this.twoFactorService.isTwoFactorAuthenticationCodeValid(token, secret);
      console.info("Is Valid" +  isValid);
    }

    @Post("/auth/user")
    @HttpCode(200)
    async getToken(@Body() body: any, @Response() res): Promise<Response> {
      const code = body.code; 
      const profile = await this.loginService.getToken(code);
      
      
      res.cookie('accessToken','teste', {
        expires: new Date(new Date().getTime() + 30 * 10000),
        httpOnly: true,
        domain: 'localhost'
        
      });
    
    return res.send(profile);
    }

}
