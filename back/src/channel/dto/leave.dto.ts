import { IsNotEmpty, IsNumber } from 'class-validator';

export class LeaveDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;
}
