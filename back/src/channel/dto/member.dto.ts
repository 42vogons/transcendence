import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MemberDto {
  @IsNotEmpty()
  @IsNumber()
  user_id: number;

  @IsNotEmpty()
  @IsNumber()
  channel_id: number;

  @IsNotEmpty()
  @IsString()
  status: string;
}
