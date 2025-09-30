import { ValidationPipe, ValidationPipeOptions } from '@nestjs/common';

export class CustomValidationPipe extends ValidationPipe {
  constructor(options?: ValidationPipeOptions) {
    super({
      ...options,
      whitelist: true,
      transform: true,
      stopAtFirstError: true,
      validateCustomDecorators: true,
    });
  }
}
