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
import { MatchHistory, MatchResult } from './types';

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
			id: match.history_id,
			player1: {
				userID: match.player1_user_id,
				username: match.player1_username,
				score: match.player1_score,
			},
			player2: {
				userID: match.player2_user_id,
				username: match.player2_username,
				score: match.player2_score,
			},
			winnerID: match.winner_id,
			looserID: match.looser_id,
			endedAt: match.ended_at
		}
		return matchHistoryResponse
	})
	return matchHistoryResponseList
  }
}
