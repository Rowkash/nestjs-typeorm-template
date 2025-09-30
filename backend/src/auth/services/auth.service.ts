import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, verify } from 'argon2';

import { UsersService } from '@/users/services/users.service';
import { AuthLoginDto } from '@/auth/dto/auth-login.dto';
import { SessionsService } from '@/sessions/services/sessions.service';
import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';
import { IUserLoginData } from '@/auth/interfaces/auth-service.interface';
import { TokenService } from '@/auth/services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly sessionsService: SessionsService,
    private readonly tokenService: TokenService,
  ) {}

  async register(dto: AuthRegisterDto) {
    await this.userService.checkUserEmailExists(dto.email);
    const hashPass = await hash(dto.password);
    const user = await this.userService.create({ ...dto, password: hashPass });
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user);

    await this.sessionsService.create({ user, refreshToken });

    return { accessToken, refreshToken };
  }

  async login(data: IUserLoginData) {
    const { sessionId, ...userData } = data;
    const user = await this.validateUser(userData);
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(user);
    const sessions = await this.sessionsService.findAllByUser(user.id);

    if (sessions && sessions.length > 0) {
      await this.sessionsService.updateSessions({
        sessions,
        cacheData: { user, refreshToken },
      });
    } else {
      await this.sessionsService.create({ user, refreshToken });
    }
    if (sessionId) await this.sessionsService.remove(sessionId);

    return { accessToken, refreshToken };
  }

  async refreshTokens(sessionId: string) {
    const session = await this.sessionsService.findByKey(sessionId);
    if (!session)
      throw new UnauthorizedException('Refresh token expired or its invalid');
    const userData = { id: session.userId, email: session.email };
    const { accessToken, refreshToken } =
      await this.tokenService.generateTokens(userData);
    const sessions = await this.sessionsService.findAllByUser(userData.id);
    if (sessions && sessions.length > 0)
      await this.sessionsService.updateSessions({
        sessions,
        cacheData: { user: userData, refreshToken },
      });
    await this.sessionsService.remove(sessionId);

    return { accessToken, refreshToken };
  }

  async logout(sessionId: string) {
    const session = await this.sessionsService.findByKey(sessionId);
    if (!session)
      throw new UnauthorizedException('Session not found or expired');
    await this.sessionsService.remove(sessionId);
  }

  private async validateUser(dto: AuthLoginDto) {
    const user = await this.userService.getOne({ email: dto.email });
    if (user) {
      const passEquals = await verify(user.password, dto.password);
      if (passEquals) return user;
    }

    throw new BadRequestException({ message: 'Wrong user name or password' });
  }
}
