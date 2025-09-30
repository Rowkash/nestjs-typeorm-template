import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { AuthRegisterDto } from '@/auth/dto/auth-register.dto';

@ValidatorConstraint({ name: 'IsConfirmPasswordMatched', async: false })
@Injectable()
export class IsConfirmPasswordMatchedConstraint implements ValidatorConstraintInterface {
  validate(confirmPassword: string, args: ValidationArguments) {
    const object = args.object as AuthRegisterDto;
    return confirmPassword === object?.password;
  }

  defaultMessage() {
    return 'Confirm password does not match password';
  }
}

export function IsConfirmPasswordMatched(
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'IsConfirmPasswordMatched',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsConfirmPasswordMatchedConstraint,
    });
  };
}
