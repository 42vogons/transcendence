import { Injectable } from "@nestjs/common";

@Injectable()
export class PlayService {
	async test() {
		return 'play service ok';
	}
}
