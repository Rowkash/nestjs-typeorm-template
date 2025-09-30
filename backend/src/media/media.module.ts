import { forwardRef, Module } from '@nestjs/common';

import { MinioModule } from '@/minio/minio.module';
import { MediaProcessingService } from '@/media/media-processing.service';
import { MediaProcessingConsumer } from '@/media/consumers/media-processing.consumer';
import { PortfoliosModule } from '@/portfolios/portfolios.module';

@Module({
  imports: [MinioModule, forwardRef(() => PortfoliosModule)],
  providers: [MediaProcessingConsumer, MediaProcessingService],
  exports: [MediaProcessingConsumer, MediaProcessingService],
})
export class MediaModule {}
