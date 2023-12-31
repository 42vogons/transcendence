import { users } from '@prisma/client';

export class UserEntity implements users {
  user_id: number;
  username: string;
  email: string;
  password_hash: string;
  avatar_url: string;
  status: string;
  two_factor_enabled: boolean;
  total_games: number;
  total_wins: number;
  total_losses: number;
  ladder_level: number;
}
