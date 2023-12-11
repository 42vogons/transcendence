import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { LoginService } from './login.service';
import { TwoFactorAutenticateService } from './two-factor-autenticate/two-factor-autenticate.service';

@Module({
  controllers: [LoginController],
  providers: [LoginService, TwoFactorAutenticateService]
})
export class LoginModule {}
