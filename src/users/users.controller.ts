import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(private userService: UsersService) {}

  @Post('/sign-up')
  createUser(@Body() createUser: CreateUserDto) {
    const newUser = this.userService.create(
      createUser.email,
      createUser.password,
      createUser.userName,
    );
    return newUser;
  }

  @Get('/:id')
  async findUserById(@Param('id') id: number) {
    try {
      const user = await this.userService.findUserById(id);
      console.log('user', user);
      return user;
    } catch (err) {
      throw new NotFoundException(err?.message || 'NOT FOUND');
    }
  }

  @Get('/')
  listUsers() {
    const user = this.userService.listUsers();
    return user;
  }

  @Put('/:id')
  updateUserById(@Body() userDto: UpdateUserDto, @Param('id') id: number) {
    const user = this.userService.updateUserById(userDto, id);
    return user;
  }

  @Delete('/:id')
  deleteUserById(@Param('id') id: number) {
    const user = this.userService.removeUserById(id);
    return user;
  }
}
