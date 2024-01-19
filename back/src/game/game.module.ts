import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameController } from './game.controller';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';

@Module({
  imports: [ConfigModule],
  controllers: [GameController],
  providers: [GameService, GameGateway],
})
export class GameModule {}
