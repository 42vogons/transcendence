import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Req,
	Response,
	UseGuards,
	Param,
} from '@nestjs/common';
import { GameService } from './game.service';
import { MatchHistory } from './types';

@Controller('game')
export class GameController {
  constructor(
    private readonly gameService: GameService,
  ) {}

  @Get('match_history/:user_id')
  async getAllMatchHistoryByUserID(@Param() params: any) {
	const matchHistoryList = this.gameService.getAllMatchHistoryByUserID(params.user_id)
	let matchHistoryResponseList: MatchHistory[];
	matchHistoryResponseList = (await matchHistoryList).map(match => {
		const matchHistoryResponse: MatchHistory = {
			player1UserID: match.player1_user_id,
			player1Username: match.player1_username,
			player1Score: match.player1_score,
			player2UserID: match.player2_user_id,
			player2Username: match.player2_username,
			player2Score: match.player2_score,
			winnerID: match.winner_id,
			looserID: match.looser_id,
			endedAt: match.ended_at
		}
		return matchHistoryResponse
	})
	return matchHistoryResponseList
  }
}
