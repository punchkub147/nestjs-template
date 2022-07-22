import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  resetPasswordToken: string;

  @ApiProperty({ default: 'changed' })
  @IsString()
  password: string;
}
