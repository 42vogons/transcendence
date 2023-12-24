import { Module } from '@nestjs/common';
import { PlayController } from './play.controller';
import { PlayService } from './play.service';
import { PlayGateway } from './play.gateway';

@Module({
  controllers: [PlayController],
  providers: [PlayService, PlayGateway]
})
export class PlayModule {}
