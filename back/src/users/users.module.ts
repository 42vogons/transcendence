import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersRepository } from './repositories/users.repository';
import { JwtService } from '@nestjs/jwt';
import { TwoFactorAutenticateService } from '../two-factor-autenticate/two-factor-autenticate.service';

@Module({
  controllers: [UsersController],
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
