import { Body, Controller, Delete, Post, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendDto } from './dto/create-friend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post('/add')
  async addFriend(@Req() request, @Body() body: FriendDto) {
    return this.friendsService.addFriend(
      request.cookies.accessToken,
      body.friend_id,
    );
  }
  @Delete('/remove')
  async removaFriend(@Req() request, @Body() body: FriendDto) {
    return this.friendsService.removeFriend(
      request.cookies.accessToken,
      body.friend_id,
    );
  }
}
