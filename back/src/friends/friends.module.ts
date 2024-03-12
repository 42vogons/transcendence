import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendsRepository } from './repositories/friends.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
//import { UsersService } from 'src/users/users.service';
//import { UsersRepository } from 'src/users/repositories/users.repository';
import { TwoFactorAutenticateService } from 'src/two-factor-autenticate/two-factor-autenticate.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [JwtModule, UsersModule],

  controllers: [FriendsController],
  providers: [
    FriendsService,
    FriendsRepository,
    PrismaService,
    JwtService,
    //UsersService,
    //UsersRepository,
    TwoFactorAutenticateService,
  ],
  exports: [
    FriendsService,
    PrismaService,
    FriendsRepository,
    //UsersService,
    //UsersRepository,
  ],
})
export class FriendsModule {}
