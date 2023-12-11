import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller'
import { LoginService } from './login/login.service';
import { TwoFactorAutenticateService } from './login/two-factor-autenticate/two-factor-autenticate.service';
import { LoginModule } from './login/login.module';

@Module({
  imports: [LoginModule],
  controllers: [LoginController],
  providers: [LoginService,TwoFactorAutenticateService ],
})
export class AppModule {}
