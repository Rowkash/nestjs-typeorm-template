import { PartialType, PickType } from '@nestjs/swagger';

import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';

export class UpdateUserDto extends PartialType(
  PickType(AuthRegisterDto, ['name', 'lastName'] as const),
) {}
