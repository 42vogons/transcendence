import {
	IsInt,
	IsNotEmpty,
	IsString,
	IsDate,
} from 'class-validator';

export class CreateMatchHistoryDto {
	history_id: number;

	@IsInt()
	@IsNotEmpty()
	player1_user_id: number;

	@IsString()
	@IsNotEmpty()
	player1_username: string;

	@IsInt()
	@IsNotEmpty()
	player1_score: number;

  @IsString()
  @IsNotEmpty()
  player1_avatar_url: string;

	@IsInt()
	@IsNotEmpty()
	player2_user_id: number;

	@IsString()
	@IsNotEmpty()
	player2_username: string;

	@IsInt()
	@IsNotEmpty()
	player2_score: number;

  @IsString()
  @IsNotEmpty()
  player2_avatar_url: string;

	@IsInt()
	@IsNotEmpty()
	winner_id: number;

	@IsInt()
	@IsNotEmpty()
	looser_id: number;

	@IsDate()
	@IsNotEmpty()
	ended_at: Date;
}
