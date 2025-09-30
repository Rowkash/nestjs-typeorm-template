import { AuthLoginDto } from '@/auth/dto/auth-login.dto';

export interface IUserLoginData extends AuthLoginDto {
  sessionId?: string;
}
