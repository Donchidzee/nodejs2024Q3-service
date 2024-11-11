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
  getAll(): UserResponse[] {
    return this.userService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOne(@Param('id') id: string): UserResponse {
    return this.userService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto): UserResponse {
    return this.userService.create(createUserDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id') id: string,
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): UserResponse {
    return this.userService.update(id, updatePasswordDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string): void {
    this.userService.remove(id);
  }
}
