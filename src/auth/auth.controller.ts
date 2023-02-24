import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

import { AuthService } from './auth.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto as RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(
    @Body() registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(loginDto);
  }

  @UseGuards(JwtAuthGuard)
  @Post('test')
  test() {
    return true;
  }
}
