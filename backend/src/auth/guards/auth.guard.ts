import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ICustomRequest } from '@/common/interfaces/custom-request.interface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const request: ICustomRequest = context.switchToHttp().getRequest();
    const { user } = request;
    if (!user) throw new ForbiddenException('You are not logged in');

    return true;
  }
}
