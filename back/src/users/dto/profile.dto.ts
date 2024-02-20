// user.dto.ts

export class ProfileDto {
  user_id: number = 0;
  username: string = '';
  email: string = '';
  avatar_url: string = '';
  status: string = '';
  token: string = '';
  token_secret: string = '';
  total_games: number = 0;
  total_wins: number = 0;
  total_losses: number = 0;
  ladder_level: number = 0;
}
