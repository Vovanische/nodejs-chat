import {
  Body,
  Controller,
  Delete,
  Patch,
  Req,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-guard';

import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Patch()
  updateUser(@Body() updateUserDto: UpdateUserDto, @Req() request) {
    const user = request.user;
    return this.userService.updateUser(user.email, updateUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch('change-password')
  updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
    @Req() request,
  ): Promise<any> {
    const user = request.user;
    return this.userService.updatePassword(user.email, updatePasswordDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete()
  deleteUser(@Req() request) {
    const user = request.user;
    return this.userService.deleteUser(user.email);
  }
}
