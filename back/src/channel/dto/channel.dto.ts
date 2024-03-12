import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class ChannelDto {
  @IsNotEmpty()
  @IsNumber()
  channel_id: number;

  @IsString()
  @IsOptional()
  password: string;
}
