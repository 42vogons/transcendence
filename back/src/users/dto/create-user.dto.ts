import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  
  user_id: number;

  @IsEmail()
  @IsNotEmpty()
  email: string;

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
