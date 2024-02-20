import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  //user_id: number;

  @IsInt()
  @IsNotEmpty()
  sender_id: number;

  @IsInt()
  channel_id: number;

  @IsString()
  @IsNotEmpty()
  content: string;
}
