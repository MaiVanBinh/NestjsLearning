import { IsEmail } from 'class-validator';
import {
  AfterInsert,
  AfterUpdate,
  BeforeRemove,
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsEmail()
  email: string;

  @Column()
  password: string;

  @Column()
  userName?: string;

  @AfterInsert()
  logInsert() {
    console.log(`Insert user with id: ${this.id}`);
  }

  @AfterUpdate()
  logUpdate() {
    console.log('Updated user with id:' + this.id);
  }

  @BeforeRemove()
  logRemove() {
    console.log('Remove user with id:' + this.id);
  }
}
