import { IsString, IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  oldPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(3)
  newPassword: string;
}
