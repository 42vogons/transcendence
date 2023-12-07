import { Controller, Get, Post, Body, HttpCode, Query  } from '@nestjs/common';
import { AppService } from '../service/app.service';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post()
  getHello(): string {
    return this.appService.getHello();
  }

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

  @Get("/login")
  @HttpCode(200)
  async checkLogin(): Promise<any> {
    try {
      const data = await this.appService.checkLogin();
      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  // 00e746c0fde2d56dcac6ec1873faaecb5b80a5dda3d899c19e76fcee92fbc51e


}
