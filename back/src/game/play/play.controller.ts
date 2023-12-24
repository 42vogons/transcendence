import { Controller, Get, Logger } from '@nestjs/common';
import { PlayService } from './play.service';

@Controller('play')
export class PlayController {
	constructor(private playService: PlayService) {}

	@Get()
	async test() {
		const result = await this.playService.test();
		return result;
	}
}
