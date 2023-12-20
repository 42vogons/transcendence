import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersRepository } from './repositories/users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly repository: UsersRepository) {}

  createNewUser(profile: any){
    const newUser :CreateUserDto = new CreateUserDto();
    newUser.username = profile.login;
    newUser.email = profile.email;
    newUser.two_factor_enabled = false;
    newUser.user_id = parseInt(profile.id,10);
    this.create(newUser);
    console.log("Novo usuário criado");

  }

  create(createUserDto: CreateUserDto) {
    return this.repository.create(createUserDto);
  }

  findAll() {
    return this.repository.findAll();
  }

  findOne(user_id: number) {
    return this.repository.findOne(user_id);
  }

  update(user_id: number, updateUserDto: UpdateUserDto) {
    return this.repository.update(user_id, updateUserDto);
  }

  remove(user_id: number) {
    return this.repository.remove(user_id);
  }
}
