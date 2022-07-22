import {
  Controller,
  Request,
  Get,
  Post,
  UseGuards,
  Body,
} from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import { AuthService } from '../auth/auth.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from '../auth/guards/local-auth.guard';
import { ChangePasswordDto } from './dtos/change-password.dto';
import { LoginDto } from './dtos/login.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto) {
    const jwt = await this.authService.login(req.user);
    return { ...req.user, ...jwt };
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Post('register')
  create(@Body() createUserDto: CreateUserDto) {
    const user = this.usersService.create(createUserDto);
    return user;
  }

  @Get('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const { username } = resetPasswordDto;
    await this.usersService._checkNotFound({ username });

    await this.usersService.createResetPasswordToken(username);

    const user = this.usersService.findOneBy({ username });
    return user;
  }

  @Post('reset-password')
  async changePasswordByToken(@Body() changePasswordDto: ChangePasswordDto) {
    const { resetPasswordToken } = changePasswordDto;
    await this.usersService._checkNotFound({ resetPasswordToken });

    const user = this.usersService.update(
      { resetPasswordToken },
      { password: changePasswordDto.password, resetPasswordToken: null },
    );
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Post('change-password')
  async changePassword(
    @Request() req,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const { username } = req;
    const { password } = changePasswordDto;
    await this.usersService._checkNotFound({ username });

    const user = this.usersService.update({ username }, { password });
    return user;
  }
}
