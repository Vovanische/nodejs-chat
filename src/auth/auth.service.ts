import { BadRequestException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { TokenService } from 'src/jwt-token/jwt-token.service';
import { userError } from 'src/user/constants/user-error.constants';

import { UserService } from '../user/user.service';
import { LoginRequestDto } from './dto/login-request.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { RegisterRequestDto } from './dto/register-request.dto';
import { RegisterResponseDto } from './dto/register-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
  ) {}

  async register(
    registerDto: RegisterRequestDto,
  ): Promise<RegisterResponseDto> {
    const existUser = await this.userService.findUserByEmail(registerDto.email);
    if (existUser) throw new BadRequestException(userError.USER_EMAIL_EXISTS);
    return this.userService.create(registerDto);
  }

  async validatePassword(reqPassword: string, userHashedPassword: string) {
    const isValidPassword = await bcrypt.compare(
      reqPassword,
      userHashedPassword,
    );
    if (!isValidPassword) throw new BadRequestException(userError.WRONG_DATA);
  }

  async login(userLoginDto: LoginRequestDto): Promise<LoginResponseDto> {
    const existUser = await this.userService.findUserByEmail(
      userLoginDto.email,
    );
    if (!existUser) throw new BadRequestException(userError.USER_NOT_EXISTS);
    await this.validatePassword(userLoginDto.password, existUser.password);
    const userData = { name: existUser.name, email: existUser.email };
    const token = await this.tokenService.generateJwtToken(userData);
    const publicUser = await this.userService.publicUser(userLoginDto.email);

    return { ...publicUser, token };
  }
}
