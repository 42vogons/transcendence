import { IsNotEmpty } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  friend_id: number;
}
