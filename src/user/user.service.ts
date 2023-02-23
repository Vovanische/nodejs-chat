import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';

import { UserError } from './constants/user-error.constants';
import { SALT_OF_ROUNDS } from './constants/user.constants';
import { CreateUserDto } from './dto/create-user.dto';
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
    if (existUser) throw new BadRequestException(UserError.USER_EMAIL_EXISTS);

    newUser.password = await this.hashPassword(createUserDto.password);

    return newUser.save();
  }
}
