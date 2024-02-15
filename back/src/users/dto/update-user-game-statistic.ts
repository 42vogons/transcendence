import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserGameStatisticDto extends PartialType(CreateUserDto) {
  total_games: number;
  total_wins: number;
  total_losses: number;
}
