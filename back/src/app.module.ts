import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [LoginModule, UsersModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class AppModule {}
