import { match_history } from '@prisma/client';

export class MatchHistoryEntity implements match_history{
	history_id: number;
	player1_user_id: number;
	player1_username: string;
	player1_score: number;
  player1_avatar_url: string;
	player2_user_id: number;
	player2_username: string;
	player2_score: number;
  player2_avatar_url: string;
	winner_id: number;
	looser_id: number;
	ended_at: Date;
}
