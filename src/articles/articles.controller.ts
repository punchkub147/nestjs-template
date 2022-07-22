import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';

@Controller('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(@Body() createArticleDto: CreateArticleDto) {
    return this.articlesService.create(createArticleDto);
  }

  @Get()
  async findAll(@Query('search') search: string) {
    return this.articlesService.findAll(search);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    await this.articlesService._checkNotFound(id);

    return this.articlesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updateArticleDto: UpdateArticleDto,
  ) {
    await this.articlesService._checkNotFound(id);

    await this.articlesService.update(id, updateArticleDto);
    return this.articlesService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.articlesService._checkNotFound(id);

    await this.articlesService.remove(id);
    return this.articlesService.findOne(id);
  }
}
