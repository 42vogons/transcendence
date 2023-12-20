import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { TwoFactorAutenticateService } from './login/two-factor-autenticate/two-factor-autenticate.service';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
  imports: [LoginModule, UsersModule, JwtModule.register({
    secret: 'sua_chave_secreta',
    signOptions: { expiresIn: '1h' },
  }),],
  controllers: [LoginController],
  providers: [LoginService, TwoFactorAutenticateService],
})
export class AppModule {}
