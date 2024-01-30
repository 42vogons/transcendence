import { friends } from '@prisma/client';

export class FriendsEntity implements friends {
  friend_id: number;
  user_id: number;
}
