import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateArticleDto {
  @ApiProperty({ default: 'Article title' })
  @IsString()
  title: string;

  @ApiProperty({ default: 'Article content' })
  @IsString()
  content: string;
}
