import { IsNotEmpty } from 'class-validator';

export class CreateFriendDto {
  @IsNotEmpty()
  user_id: number;

  @IsNotEmpty()
  friend_id: number;
}
