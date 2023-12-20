import { Module } from '@nestjs/common';
import { LoginController } from './login.controller';
import { JwtModule } from '@nestjs/jwt'; // Importe o JwtModule
import { LoginService } from './login.service';
import { TwoFactorAutenticateService } from './two-factor-autenticate/two-factor-autenticate.service';
import { UsersModule } from 'src/users/users.module';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [LoginController],
  imports: [UsersModule,
    JwtModule.register({
      secret: 'sua_chave_secreta', // Substitua pela sua chave secreta
      signOptions: { expiresIn: '1h' },
    }),], // Importe o UsersModule
  providers: [LoginService, TwoFactorAutenticateService, JwtService]
})
export class LoginModule {}
