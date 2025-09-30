import { PickType } from '@nestjs/swagger';

import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';

export class AuthLoginDto extends PickType(AuthRegisterDto, [
  'email',
  'password',
] as const) {}
