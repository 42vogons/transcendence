import { Module } from '@nestjs/common';
import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { PlayController } from './game/play/play.controller';
import { PlayModule } from './game/play/play.module';
import { PlayService } from './game/play/play.service';


@Module({
  imports: [LoginModule, UsersModule, PlayModule],
  controllers: [LoginController, PlayController],
  providers: [LoginService, PlayService],
})
export class AppModule {}
