import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserError } from 'src/user/constants/user-error.constants';

import { UserService } from '../user/user.service';
import { LoginResponseDto } from './dto/login-response.dto';
import { LoginRequestDto } from './dto/login.dto';
import { RegisterResponseDto } from './dto/register-response.dto';
import { RegisterRequestDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async register(
    registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const existUser = await this.userService.findUserByEmail(registerDto.email);
    if (existUser) throw new BadRequestException(UserError.USER_EMAIL_EXISTS);
    return this.userService.create(registerDto);
  }

  async validatePassword(reqPassword: string, userHashedPassword: string) {
    const isValidPassword = await bcrypt.compare(
      reqPassword,
      userHashedPassword,
    );
    if (!isValidPassword) throw new BadRequestException(UserError.WRONG_DATA);
  }

  async login(userLoginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const existUser = await this.userService.findUserByEmail(
      userLoginDto.email,
    );
    if (!existUser) throw new BadRequestException(UserError.USER_NOT_EXISTS);

    await this.validatePassword(userLoginDto.password, existUser.password);
    return existUser;
  }
}
