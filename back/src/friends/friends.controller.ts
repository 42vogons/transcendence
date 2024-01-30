import { Body, Controller, Delete, Post, Req, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { FriendDto } from './dto/create-friend.dto';
import { AuthGuard } from 'src/login/auth.guard';

@UseGuards(AuthGuard)
@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post('/add')
  async addFriend(@Req() request, @Body() body: FriendDto) {
    return this.friendsService.addFriend(request.user.id, body.friend_id);
  }
  @Delete('/remove')
  async removaFriend(@Req() request, @Body() body: FriendDto) {
    return this.friendsService.removeFriend(request.user.id, body.friend_id);
  }
}
