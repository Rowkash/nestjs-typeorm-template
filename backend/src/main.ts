import helmet from 'helmet';
import { Logger } from 'nestjs-pino';
import { json, urlencoded } from 'express';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import cookieParser from 'cookie-parser';

import { AppModule } from '@/app.module';
import { CustomValidationPipe } from '@/common/pipes/validation.pipe';
import { setupSwagger } from '@/common/swagger-setup';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // bufferLogs: true,
  });
  const configService = app.get<ConfigService>(ConfigService);
  const PORT = configService.get<number>('app.port', 3000);

  app.use(helmet());
  // app.useLogger(app.get(Logger));
  app.setGlobalPrefix('api');
  app.enableCors();
  app.use(cookieParser());
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));

  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  app.useGlobalPipes(new CustomValidationPipe());

  setupSwagger(app);
  await app.listen(+PORT);
}

void bootstrap();
