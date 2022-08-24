import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async signUp(email: string, password: string) {
    // see if email in uses
    const user = await this.userService.findUserByEmail(email);
    if (user) {
      throw new BadRequestException('Email in use');
    }

    // generate a salt
    const salt = randomBytes(8).toString('hex');
    // Hash the salt and the password together
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    // Join the hashed result and the salt together
    const result = salt + '.' + hash.toString('hex');

    // Create a new  user and save, return user it
    return await this.userService.create(email, result, 'username');
  }

  async signIn(email: string, password: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storeHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;
    if (storeHash !== hash.toString('hex')) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
