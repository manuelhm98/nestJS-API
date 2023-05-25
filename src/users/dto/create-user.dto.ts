import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'Juan', description: 'The name user' })
  @IsString()
  @MinLength(1)
  name: string;

  @ApiProperty({ example: 'Perez', description: 'The lastName user' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiProperty({ example: 'juan@gmail.com', description: 'The email user' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: '1234', description: 'The password user' })
  @IsString()
  @MinLength(8)
  @MaxLength(12)
  password: string;

  @IsOptional()
  isActivated?: boolean;
}
