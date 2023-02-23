import { Body, Controller, Post } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';

import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  register(@Body() registerData: RegisterDto): Promise<User> {
    return this.authService.register(registerData);
  }
}
