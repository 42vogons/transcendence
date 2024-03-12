import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';

@Module({
  controllers: [UsersController],
  imports: [JwtModule],
  providers: [
    UsersService,
    PrismaService,
    UsersRepository,
    JwtService,
    TwoFactorAutenticateService,
  ],
  exports: [UsersService, PrismaService, UsersRepository], // Exporte o UsersService, se necessário
})
export class UsersModule {}
