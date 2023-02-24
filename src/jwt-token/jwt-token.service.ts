import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { EXPIRE_JWT, JWT_SECRET_KEY } from 'src/configs/jwt.config';

@Injectable()
export class TokenService {
  constructor(private readonly jwtService: JwtService) {}
  async generateJwtToken(user): Promise<string> {
    const payload = { user };
    return this.jwtService.sign(payload, {
      secret: JWT_SECRET_KEY,
      expiresIn: EXPIRE_JWT,
    });
  }
}
