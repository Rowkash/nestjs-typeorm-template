import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { IsConfirmPasswordMatched } from '@/users/validators/is-confirm-password-matched.validator';

export class AuthRegisterDto {
  @ApiProperty({ example: 'Benjamin' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  name: string;

  @ApiProperty({ example: 'Franklin' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @Length(2, 60)
  lastName: string;

  @ApiProperty({ example: 'benfrank@protonmail.com' })
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'password' })
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'password' })
  @IsConfirmPasswordMatched()
  confirmPassword: string;
}
