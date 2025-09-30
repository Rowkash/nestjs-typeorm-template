import { PickType } from '@nestjs/swagger';
import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';

export class DeleteUserDto extends PickType(AuthRegisterDto, [
  'password',
] as const) {}
