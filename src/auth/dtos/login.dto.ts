import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ default: 'admin' })
  @IsString()
  username: string;

  @ApiProperty({ default: 'admin' })
  @IsString()
  password: string;
}
