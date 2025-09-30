import { Injectable } from '@nestjs/common';
import { CacheModuleOptions, CacheOptionsFactory } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { createKeyv } from '@keyv/redis';

@Injectable()
export class CacheConfigService implements CacheOptionsFactory {
  constructor(private readonly configService: ConfigService) {}
  createCacheOptions(): CacheModuleOptions {
    const redisUri = this.configService.get<string>('redis.url');
    const redisStore = createKeyv(redisUri, { namespace: 'redis-cache' });
    return {
      stores: [redisStore],
    };
  }
}
