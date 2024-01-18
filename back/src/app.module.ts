import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { ChatGateway } from './chat/chat.gateway';

@Module({
  imports: [LoginModule, UsersModule],
  controllers: [LoginController],
  providers: [LoginService, ChatGateway],
})
export class AppModule {}
