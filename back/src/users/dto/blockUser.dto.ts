import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class BlockUserDto {
  @IsNumber()
  @IsOptional()
  user_id?: number;

  @IsNotEmpty()
  @IsNumber()
  member_id: number;

  @IsNotEmpty()
  @IsNumber()
  channel_id: number;
}
