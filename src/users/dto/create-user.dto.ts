import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ default: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ default: 'admin' })
  @IsString()
  password: string;

  @ApiProperty({ default: 'Admin' })
  @IsString()
  firstName: string;

  @ApiProperty({ default: null })
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  isActive: boolean;
}
