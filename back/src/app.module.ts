import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { TwoFactorAutenticateService } from './login/two-factor-autenticate/two-factor-autenticate.service';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [LoginModule, UsersModule],
  controllers: [LoginController],
  providers: [LoginService,TwoFactorAutenticateService ],
})
export class AppModule {}
