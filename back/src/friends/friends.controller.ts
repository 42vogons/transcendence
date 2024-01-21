import { Body, Controller, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post('/add')
  async addFriend(@Body() createFriendDto: CreateFriendDto) {
    console.log('friends ' + createFriendDto.friend_id);
    return this.friendsService.addFriend(createFriendDto);
  }
}
