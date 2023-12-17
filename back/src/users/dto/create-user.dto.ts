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

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  password_hash: string;

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
