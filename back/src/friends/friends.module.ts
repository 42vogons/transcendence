import { Module } from '@nestjs/common';
import { FriendsController } from './friends.controller';
import { FriendsService } from './friends.service';
import { FriendsRepository } from './repositories/friends.repository';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtModule, JwtService } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: 'sua_chave_secreta',
      signOptions: { expiresIn: '1h' },
    }),
  ],

  controllers: [FriendsController],
  providers: [FriendsService, FriendsRepository, PrismaService, JwtService],
  exports: [FriendsService, PrismaService, FriendsRepository], // Exporte o UsersService, se necessário
})
export class FriendsModule {}
