import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ChannelDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;

  @IsString()
  password: string;
}
