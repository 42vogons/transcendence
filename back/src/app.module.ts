import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { LoginController } from './login/login.controller';
import { FriendsController } from './friends/friends.controller';
import { LoginService } from './login/login.service';
import { FriendsService } from './friends/friends.service';
import { TwoFactorAutenticateService } from './two-factor-autenticate/two-factor-autenticate.service';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';
import { GameModule } from './game/game.module';
import { FriendsModule } from './friends/friends.module';
import { ChannelService } from './channel/channel.service';
import { ChannelController } from './channel/channel.controller';
import { ChannelModule } from './channel/channel.module';
import { ChatGateway } from './chat/chat.gateway';
import { ChatModule } from './chat/chat.module';
import { ChatService } from './chat/chat.service';

const secretJwt = process.env.SECRET_JWT;

@Module({
  imports: [
    LoginModule,
    UsersModule,
    JwtModule.register({
      secret: secretJwt,
      signOptions: { expiresIn: '48h' },
    }),
    FriendsModule,
    ChannelModule,
    GameModule,
    ChatModule,
  ],
  controllers: [LoginController, FriendsController, ChannelController],
  providers: [
    LoginService,
    TwoFactorAutenticateService,
    FriendsService,
    ChannelService,
    ChatGateway,
    ChatService,
  ],
})
export class AppModule {}
