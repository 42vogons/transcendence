import { IsNotEmpty, IsNumber } from 'class-validator';

export class RemoveMemberDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;

  @IsNotEmpty()
  @IsNumber()
  member_id: number;
}
