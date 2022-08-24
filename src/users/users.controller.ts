import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Session,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto, UpdateUserDto, UserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';

@Controller('users')
@Serialize(UserDto)
export class UsersController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}

  @Get('/whoiam')
  async whoiam(@Session() session: any) {
    const userId = session.userId;
    if (!userId) {
      return null;
    }
    const user = await this.userService.findUserById(userId);
    return user;
  }

  @Post('/signout')
  signout(@Session() session: any) {
    session.userId = null;
  }

  @Get('/colors/:color')
  setColor(@Param('color') color: string, @Session() session: any) {
    session.color = color;
  }

  @Get('/colors')
  getColor(@Session() session: any) {
    return session.color;
  }

  @Post('/sign-up')
  async createUser(@Body() createUser: CreateUserDto, @Session() session: any) {
    const newUser = await this.authService.signUp(
      createUser.email,
      createUser.password,
    );
    session.userId = newUser.id;
    return newUser;
  }

  @Post('/sign-in')
  async signin(@Body() createUser: CreateUserDto, @Session() session: any) {
    const newUser = await this.authService.signIn(
      createUser.email,
      createUser.password,
    );
    session.userId = newUser.id;
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
