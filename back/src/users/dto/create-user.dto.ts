import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  user_id: number;

  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  user_id_42: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  token: string;

  @IsString()
  token_secret: string;

  @IsUrl()
  avatar_url: string;

  @IsString()
  status: string;

  @IsBoolean()
  @IsNotEmpty()
  two_factor_enabled: boolean;

  @IsInt()
  total_games: number;

  @IsInt()
  total_wins: number;

  @IsInt()
  total_losses: number;

  @IsInt()
  ladder_level: number;
}
