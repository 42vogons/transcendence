import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';
import { NotFoundError } from '../common/errors/types/NotFoundError';
import { UserEntity } from './entities/user.entity';
@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  create(createUserDto: CreateUserDto) {
    return this.repository.create(createUserDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  async findOne(user_id: number): Promise<UserEntity> {
    const user = await this.repository.findOne(user_id);
    if (!user) {
      throw new NotFoundError('User not found');
    }
    return user;
  }

  update(user_id: number, updateUserDto: UpdateUserDto) {
    return this.repository.update(user_id, updateUserDto);
  }

  remove(user_id: number) {
    return this.repository.remove(user_id);
  }
}
