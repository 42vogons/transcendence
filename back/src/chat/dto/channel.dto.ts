import { IsNotEmpty, IsNumber } from 'class-validator';

export class ChannelDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;

  @IsNumber()
  password: string;
}
