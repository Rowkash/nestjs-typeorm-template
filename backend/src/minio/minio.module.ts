import { Module } from '@nestjs/common';

import { MinioService } from '@/minio/services/minio.service';
import { MinioProvider } from '@/minio/services/minio.provider';

@Module({
  providers: [MinioProvider, MinioService],
  exports: [MinioService],
})
export class MinioModule {}
