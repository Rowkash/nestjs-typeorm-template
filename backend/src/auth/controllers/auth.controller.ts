import { ApiOperation } from '@nestjs/swagger';
import type { Response } from 'express';
import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';
import { AuthService } from '@/auth/services/auth.service';
import { clearCookie, setCookie } from '@/common/useCookie';
import { AuthLoginDto } from '@/auth/dto/auth-login.dto';
import type { ICustomRequest } from '@/common/interfaces/custom-request.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({
    summary: 'Register',
    description: 'Register user and put pair of tokens to cookie',
  })
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(
    @Body() dto: AuthRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.register(dto);
    setCookie({ refreshToken, accessToken, res });
    return 'Successfully registered';
  }

  @ApiOperation({
    summary: 'Login',
    description: 'Login user and put pair of tokens to cookie',
  })
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Login' })
  async login(
    @Body() dto: AuthLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } = await this.authService.login(dto);

    setCookie({ accessToken, refreshToken, res });

    return 'Successfully logged in';
  }

  @ApiOperation({
    summary: 'Logout',
    description: 'Remove tokens from cookie',
  })
  @Post('logout')
  @ApiOperation({
    summary: 'Logout',
    description: 'Delete cookie and session',
  })
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: ICustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: sessionId } = req.cookies;
    if (!sessionId) throw new UnauthorizedException();
    await this.authService.logout(sessionId as string);
    clearCookie(res);
    return 'Successfully logged out';
  }

  @Post('refresh-tokens')
  @ApiOperation({
    summary: 'Refresh tokens',
    description:
      'Refresh tokens by cookie refresh token. Return both of them and update session',
  })
  @HttpCode(HttpStatus.OK)
  async refreshTokens(
    @Req() req: ICustomRequest,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { refreshToken: sessionId } = req.cookies;
    if (!sessionId) throw new UnauthorizedException();
    const { accessToken, refreshToken } = await this.authService.refreshTokens(
      sessionId as string,
    );

    setCookie({ accessToken, refreshToken, res });

    return 'Successfully refresh tokens';
  }
}
