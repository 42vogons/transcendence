import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchHistoryRespository } from './repositories/match-history.repository';
import { GameController } from './game.controller';

@Module({
  imports: [ConfigModule],
  controllers: [GameController],
  providers: [GameService, GameGateway, PrismaService, MatchHistoryRespository],
  exports: [PrismaService, MatchHistoryRespository]
})
export class GameModule {}
