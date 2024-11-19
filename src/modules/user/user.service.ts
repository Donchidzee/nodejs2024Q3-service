import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponse } from './interfaces/user.interface';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  private toUserResponse(user: User): UserResponse {
    const { password, createdAt, updatedAt, ...rest } = user;
    return {
      ...rest,
      createdAt: Number(createdAt),
      updatedAt: Number(updatedAt),
    };
  }

  async findAll(): Promise<UserResponse[]> {
    const users = await this.userRepository.find();
    return users.map((user) => this.toUserResponse(user));
  }

  async findOne(id: string): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.toUserResponse(user);
  }

  async create(createUserDto: CreateUserDto): Promise<UserResponse> {
    const existingUser = await this.userRepository.findOne({
      where: { login: createUserDto.login },
    });
    if (existingUser) {
      throw new BadRequestException('Login already exists');
    }
    const user = this.userRepository.create(createUserDto);
    await this.userRepository.save(user);
    return this.toUserResponse(user);
  }

  async update(
    id: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (user.password !== updatePasswordDto.oldPassword) {
      throw new ForbiddenException('Old password does not match');
    }
    user.password = updatePasswordDto.newPassword;
    // Version and updatedAt are handled automatically by TypeORM
    await this.userRepository.save(user);
    return this.toUserResponse(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }
}
