import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { ThrottlerModule } from '@nestjs/throttler';
import { Module } from '@nestjs/common';

import appConfig from '@/configs/app.config';
import authConfig from '@/configs/auth.config';
import { AuthModule } from '@/auth/auth.module';
import redisConfig from '@/configs/redis.config';
import minioConfig from '@/configs/minio.config';
import { UsersModule } from '@/users/users.module';
import { MinioModule } from '@/minio/minio.module';
import typeormConfig from '@/configs/typeorm.config';
import { LoggerModule } from '@/logger/logger.module';
import { SessionsModule } from '@/sessions/sessions.module';
import pinoLoggerConfig from '@/configs/pino-logger.config';
import { DatabasesModule } from '@/database/databases.module';
import { CustomThrottlerGuard } from '@/common/throtler.guard';
import { PortfoliosModule } from '@/portfolios/portfolios.module';
import { CacheConfigService } from '@/configs/cache-config.service';
import { RateLimitConfigService } from '@/configs/rate-limit-config.service';
import { MediaModule } from '@/media/media.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        appConfig,
        typeormConfig,
        authConfig,
        minioConfig,
        redisConfig,
        pinoLoggerConfig,
      ],
    }),
    CacheModule.registerAsync({
      useClass: CacheConfigService,
      isGlobal: true,
    }),
    ThrottlerModule.forRootAsync({
      useClass: RateLimitConfigService,
    }),
    // LoggerModule,
    DatabasesModule,
    UsersModule,
    AuthModule,
    SessionsModule,
    PortfoliosModule,
    MinioModule,
    MediaModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard, // global rate limit
    },
  ],
})
export class AppModule {}
