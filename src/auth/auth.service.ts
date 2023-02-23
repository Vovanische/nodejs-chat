import { Injectable } from '@nestjs/common';
import { User } from 'src/user/schemas/user.schema';

import { UserService } from '../user/user.service';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly userService: UserService,
  ) {}

  async register(registerData: RegisterDto): Promise<User> {
    return this.userService.create(registerData);

    //   const newUser = new this.userModel(registerData);
    //   newUser.password = await bcrypt.hash(newUser.password, 10);

    //   return newUser.save();
  }
}
