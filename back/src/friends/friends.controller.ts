import { Body, Controller, Post } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { log } from 'console';

@Controller('friends')
export class FriendsController {
  constructor(private friendsService: FriendsService) {}

  @Post()
  async addFriend(@Body() createFriendDto: CreateFriendDto) {
    console.log('friends ' + createFriendDto.friendId);

    return this.friendsService.addFriend(createFriendDto);
  }
}
