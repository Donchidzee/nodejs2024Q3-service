import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserResponse } from './interfaces/user.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAll(): Promise<UserResponse[]> {
    return await this.userService.findAll();
  }

  @Get(':userId')
  @HttpCode(HttpStatus.OK)
  async getOne(@Param('userId') userId: string): Promise<UserResponse> {
    return await this.userService.findOne(userId);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponse> {
    return await this.userService.create(createUserDto);
  }

  @Put(':userId')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param('userId') userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    return await this.userService.update(userId, updatePasswordDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('userId') userId: string): Promise<void> {
    await this.userService.remove(userId);
  }
}
