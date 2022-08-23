import { Injectable, Param } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dtos/create-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(email: string, password: string, userName: string) {
    const user = this.repo.create({ email, password, userName });
    return this.repo.save(user);
  }

  async findUserById(id: number) {
    const user = await this.repo.findOne({ where: { id: id } });
    if (!user) {
      throw new Error('user not found');
    }
    return user;
  }

  listUsers() {
    const users = this.repo.find();
    return users;
  }

  async updateUserById(attrs: Partial<User>, id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('user not found');
    }
    Object.assign(user, attrs);
    return this.repo.save(user);
  }

  async removeUserById(id: number) {
    const user = await this.findUserById(id);
    if (!user) {
      throw new Error('user not found');
    }
    return await this.repo.remove(user);
  }
}
