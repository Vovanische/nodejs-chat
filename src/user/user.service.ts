import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { userError } from './constants/user-error.constants';
import { userResult } from './constants/user-result.constants';
import { SALT_OF_ROUNDS } from './constants/user.constants';
import { CreateUserDto } from './dto/create-user.dto';
import { PublicUserDto } from './dto/public-user.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schemas/user.schema';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, SALT_OF_ROUNDS);
  }

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ email });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    const existUser = await this.findUserByEmail(newUser.email);
    if (existUser) throw new BadRequestException(userError.USER_EMAIL_EXISTS);

    newUser.password = await this.hashPassword(createUserDto.password);

    return newUser.save();
  }

  async publicUser(email: string): Promise<PublicUserDto> {
    return this.userModel.findOne({ email }).select('-password');
  }

  async updateUser(
    email: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserDto> {
    try {
      await this.userModel.updateOne({ email }, updateUserDto);
      return updateUserDto;
    } catch (e) {
      throw new Error(e);
    }
  }

  async updatePassword(
    email: string,
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<any> {
    const { password } = await this.findUserByEmail(email);
    const currentPassword = await bcrypt.compare(
      updatePasswordDto.oldPassword,
      password,
    );
    if (!currentPassword) return new BadRequestException(userError.WRONG_DATA);

    const newPassword = await this.hashPassword(updatePasswordDto.newPassword);
    const data = {
      password: newPassword,
    };
    return this.userModel.updateOne({ email }, data);
  }

  async deleteUser(email: string) {
    try {
      await this.userModel.deleteOne({ email });
      return userResult.DELETE_USER_SUCCESS;
    } catch (e) {
      throw new Error(e);
    }
  }
}
