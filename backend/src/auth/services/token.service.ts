import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UserEntity } from '@/users/entities/user.entity';

export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(user: Partial<UserEntity>) {
    const data = { id: user.id, email: user.email };

    const secret = this.configService.get('auth.jwtSecret');
    const expiresIn = this.configService.get('auth.jwtExpires');

    const accessToken = await this.jwtService.signAsync(data, {
      secret,
      expiresIn,
    });
    const refreshToken = crypto.randomUUID();

    return { accessToken, refreshToken };
  }
}
