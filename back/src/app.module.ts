import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

import { LoginController } from './login/login.controller';
import { LoginService } from './login/login.service';
import { LoginModule } from './login/login.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [LoginModule, UsersModule],
  controllers: [LoginController],
  providers: [LoginService, PrismaService],
})
export class AppModule {}
