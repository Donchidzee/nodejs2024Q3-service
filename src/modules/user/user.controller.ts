import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserResponse } from './interfaces/user.interface';

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
  async getOne(
    @Param('userId', ParseUUIDPipe) userId: string,
  ): Promise<UserResponse> {
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
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UserResponse> {
    return await this.userService.update(userId, updatePasswordDto);
  }

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('userId', ParseUUIDPipe) userId: string): Promise<void> {
    await this.userService.remove(userId);
  }
}
