import { Injectable } from '@nestjs/common';
import { ThrottlerOptionsFactory, minutes } from '@nestjs/throttler';
import { ThrottlerModuleOptions } from '@nestjs/throttler/dist/throttler-module-options.interface';

@Injectable()
export class RateLimitConfigService implements ThrottlerOptionsFactory {
  createThrottlerOptions(): ThrottlerModuleOptions {
    return {
      throttlers: [
        {
          ttl: minutes(1),
          limit: 500,
        },
      ],
    };
  }
}
