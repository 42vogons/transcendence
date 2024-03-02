import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GameGateway } from './game.gateway';
import { GameService } from './game.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MatchHistoryRespository } from './repositories/match-history.repository';
import { GameController } from './game.controller';
import { UsersRepository } from 'src/users/repositories/users.repository';

@Module({
  imports: [ConfigModule],
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
    PrismaService,
    MatchHistoryRespository,
    UsersRepository,
  ],
  exports: [PrismaService, MatchHistoryRespository],
})
export class GameModule {}
