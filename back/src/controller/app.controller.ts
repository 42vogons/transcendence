import { Controller, Get, Post, HttpCode, Query  } from '@nestjs/common';
import { AppService } from '../service/app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get("/auth/redirect")
    @HttpCode(200)
    async getToken(@Query('code') code: string): Promise<string> {
      const token = await this.appService.getToken(code);
      console.error('Código =: ${code}');
      const profile = await this.appService.getInfo(token.access_token);
      console.info("Ola " , profile.login);
      console.info("First Name " , profile.first_name);
      console.info("Last Name " , profile.last_name);
      console.info("Email " , profile.email);
      console.info("Imagem " , profile.image.link);

      return `Olá ${profile.login}`;
    }
}
