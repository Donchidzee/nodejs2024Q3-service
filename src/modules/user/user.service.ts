import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { User, UserResponse } from './interfaces/user.interface';
import { v4 as uuidv4, validate as isUuid } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { db } from '../../data/database';

@Injectable()
export class UserService {
  private users = db.users;

  findAll(): UserResponse[] {
    return this.users.map(({ password, ...rest }) => rest);
  }

  findOne(id: string): UserResponse {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const { password, ...rest } = user;
    return rest;
  }

  create(createUserDto: CreateUserDto): UserResponse {
    const { login, password } = createUserDto;
    const newUser: User = {
      id: uuidv4(),
      login,
      password,
      version: 1,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);
    const { password: _, ...rest } = newUser;
    return rest;
  }

  update(id: string, updatePasswordDto: UpdatePasswordDto): UserResponse {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const user = this.users.find((u) => u.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password is incorrect');
    }
    user.password = updatePasswordDto.newPassword;
    user.version += 1;
    user.updatedAt = Date.now();
    const { password, ...rest } = user;
    return rest;
  }

  remove(id: string): void {
    if (!isUuid(id)) {
      throw new BadRequestException('Invalid UUID');
    }
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found');
    }
    this.users.splice(index, 1);
  }
}
