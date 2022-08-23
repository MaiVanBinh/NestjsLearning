import { Expose } from 'class-transformer';
import { IsString, IsEmail, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  userName: string;
}

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  userName: string;
}

export class UserDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  userName: string;
}
