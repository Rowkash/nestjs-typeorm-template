import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

import { PortfolioImageEntity } from '@/portfolios/entities/portfolio-image.entity';
import { IUploadImage, MinioService } from '@/minio/services/minio.service';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import { Job } from 'bullmq';
import { JobEnum } from '@/bull/enums/job.enum';
import { PortfolioImageStatus } from '@/portfolios/enums/portfolio-image-status.enum';

export interface IAddImage extends IUploadImage {
  image: PortfolioImageEntity;
  userId: number;
}

@Injectable()
export class MediaProcessingService {
  constructor(
    private readonly minioService: MinioService,
    private readonly portfolioImagesService: PortfolioImagesService,
  ) {}

  // can be extended by processing logic (converting, scanning etc)

  async addImage(data: IAddImage) {
    await this.minioService.uploadFileStream(data);
    await this.portfolioImagesService.update({
      id: data.image.id,
      userId: data.userId,
      portfolioId: data.image.portfolioId,
      status: PortfolioImageStatus.ACTIVE,
    });
    fs.unlinkSync(data.file.path);
  }

  async onFailedAddImage(job: Job<IAddImage, any, JobEnum>) {
    const countOfAttempts = job.opts.attempts || 1;
    if (job.attemptsMade >= countOfAttempts) {
      await this.portfolioImagesService.updateStatus(
        job.data.image.id,
        PortfolioImageStatus.ERROR,
      );
      fs.unlinkSync(job.data.file.path);
      // ('');
    }
    return;
  }
}
