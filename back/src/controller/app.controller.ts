import { Controller, Body, Post, HttpCode, Query, Response  } from '@nestjs/common';
import { AppService } from '../service/app.service';
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post("/auth/user")
    @HttpCode(200)
    async getToken(@Body() body: any, @Response() res): Promise<Response> {
      const code = body.code; 
      const token = await this.appService.getToken(code);
      console.error('Código =: ${code}');
      const profile = await this.appService.getInfo(token.access_token);
      console.info("Ola " , profile.login);
      console.info("First Name " , profile.first_name);
      console.info("Last Name " , profile.last_name);
      console.info("Email " , profile.email);
      console.info("Imagem " , profile.image.link);
      
      res.cookie('accessToken','teste', {
        expires: new Date(new Date().getTime() + 30 * 10000),
        httpOnly: true,
        domain: 'localhost'
        
     });
    
    return res.send(profile);
    }
}
