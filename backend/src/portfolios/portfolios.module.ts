import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MinioModule } from '@/minio/minio.module';
import { MediaModule } from '@/media/media.module';
import { BullQueueModule } from '@/bull/bull-queue.module';
import { PortfolioEntity } from '@/portfolios/entities/portfolio.entity';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfoliosController } from '@/portfolios/controllers/portfolios.controller';
import { PortfolioImageEntity } from '@/portfolios/entities/portfolio-image.entity';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import { PortfolioImagesController } from '@/portfolios/controllers/portfolio-images.controller';
import { PublicPortfoliosController } from '@/portfolios/controllers/public-portfolios.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PortfolioEntity, PortfolioImageEntity]),
    MinioModule,
    MediaModule,
    BullQueueModule,
  ],
  controllers: [
    PortfoliosController,
    PublicPortfoliosController,
    PortfolioImagesController,
  ],
  providers: [PortfoliosService, PortfolioImagesService],
  exports: [PortfoliosService, PortfolioImagesService],
})
export class PortfoliosModule {}
