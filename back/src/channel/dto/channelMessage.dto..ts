import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChannelMessageDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;
}
