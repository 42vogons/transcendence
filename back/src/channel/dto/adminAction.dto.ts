import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AdminActionDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;

  @IsNotEmpty()
  @IsNumber()
  member_id: number;

  @IsNotEmpty()
  @IsString()
  action: string;
}
