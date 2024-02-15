import { IsNotEmpty } from 'class-validator';

export class FriendDto {
  @IsNotEmpty()
  member_id: number;
}
