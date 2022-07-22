import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  findAll() {
    const users = this.usersService.findAll();
    return users;
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    await this.usersService._checkNotFound(id);

    return this.usersService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService._checkNotFound(id);

    await this.usersService.update(id, updateUserDto);
    return this.usersService.findOne(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.usersService._checkNotFound(id);

    await this.usersService.remove(id);
    return this.usersService.findOne(id);
  }
}
