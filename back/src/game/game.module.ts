import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [ConfigModule],
  providers: [GameService, GameGateway],
})
export class GameModule {}
