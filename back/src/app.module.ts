import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller'
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';

@Module({
  imports: [LoginModule],
  controllers: [LoginController],
  providers: [LoginService],
})
export class AppModule {}
