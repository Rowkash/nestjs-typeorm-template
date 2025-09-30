import { LoggerModule as PinoLoggerModule } from 'nestjs-pino';
import { Params } from 'nestjs-pino/params';
import { ConfigService } from '@nestjs/config';
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
  imports: [
    PinoLoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService<Params, true>) =>
        configService.get<Params>('pinoLogger', { infer: true }),
    }),
  ],
})
export class LoggerModule {}
