import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';

import { JobEnum } from '@/bull/enums/job.enum';
import { QueueEnum } from '@/bull/enums/queue.enum';
import { IMinioConfig } from '@/configs/minio.config';
import { MinioService } from '@/minio/services/minio.service';
import {
  IGetOnePortfolioImageOptions,
  ICreatePortfolioImagePayload,
  IPortfolioImageDataRemoving,
  IUpdatePortfolioImagePayload,
  IGetPortfolioImageRelationsOptions,
  IGetPortfolioImageFilterOptions,
} from '@/portfolios/interfaces/portfolio-images.service.interfaces';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfolioImageStatus } from '@/portfolios/enums/portfolio-image-status.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioImageEntity } from '@/portfolios/entities/portfolio-image.entity';
import {
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

@Injectable()
export class PortfolioImagesService {
  constructor(
    @InjectRepository(PortfolioImageEntity)
    private readonly repository: Repository<PortfolioImageEntity>,
    private readonly portfoliosService: PortfoliosService,
    private readonly storage: MinioService,
    private readonly configService: ConfigService,
    @InjectQueue(QueueEnum.MEDIA_PROCESSING_QUEUE)
    private readonly mediaProcessingQueue: Queue,
  ) {}

  async create(data: ICreatePortfolioImagePayload) {
    const { file, ...createData } = data;
    await this.portfoliosService.findOne({
      id: createData.portfolioId,
      userId: createData.userId,
    });
    const fileName = file.filename;
    const storageKey = `${createData.userId}/${fileName}`;
    const url = this.getImagePathFromS3(storageKey);

    const entity = this.repository.create({
      ...data,
      fileName,
      url,
    });
    const image = await this.repository.save(entity);
    await this.mediaProcessingQueue.add(
      JobEnum.ADD_MEDIA_JOB,
      { key: storageKey, file, image, userId: createData.userId },
      {
        removeOnComplete: true,
        attempts: 2,
        delay: 1000,
      },
    );

    return image;
  }

  async updateStatus(id: number, status: PortfolioImageStatus) {
    await this.repository.update(id, { status });
  }

  async update(data: IUpdatePortfolioImagePayload) {
    const { id, userId, portfolioId, file, ...updateData } = data;
    const image = await this.findOne({ id, userId, portfolioId });
    if (!image) throw new NotFoundException('Portfolio image not found');
    if (file) updateData.status = PortfolioImageStatus.PENDING;
    const updatedRes = await this.repository.update(id, {
      ...updateData,
    });
    if (updatedRes.affected == 0) return null;

    if (file) {
      const storageKey = `${userId}/${image.fileName}`;
      await this.mediaProcessingQueue.add(
        JobEnum.ADD_MEDIA_JOB,
        { key: storageKey, file, image, userId },
        {
          removeOnComplete: true,
          attempts: 2,
          delay: 1000,
        },
      );
    }
  }

  async findOne(options: IGetOnePortfolioImageOptions) {
    const findOptions: FindOneOptions<PortfolioImageEntity> = {};
    findOptions.where = this.buildWhere(options);
    if (options.relations) {
      findOptions.relations = this.buildRelations(options.relations);
    }
    const image = await this.repository.findOne(findOptions);
    if (!image) throw new NotFoundException('Image not found');
    return image;
  }

  async remove(options: IPortfolioImageDataRemoving) {
    const { portfolioId, imageId } = options;
    const relations = { portfolio: true };
    const image = await this.findOne({ id: imageId, portfolioId, relations });

    if (image.portfolio.userId !== options.userId)
      throw new ForbiddenException('Permissions error');

    await Promise.all([
      this.storage.deleteFile(image.fileName),
      this.repository.delete(imageId),
    ]);
  }

  getImagePathFromS3(key: string) {
    const minioConfig: IMinioConfig = this.configService.get<IMinioConfig>(
      'minio',
      {
        infer: true,
      },
    );

    return `${minioConfig.endpoint}/${minioConfig.bucketName}/${key}`;
  }

  buildWhere(
    options: IGetPortfolioImageFilterOptions,
  ): FindOptionsWhere<PortfolioImageEntity> {
    const where: FindOptionsWhere<PortfolioImageEntity> = {};

    if (options.id != null) where.id = options.id;
    if (options.portfolioId != null) where.portfolioId = options.portfolioId;

    return where;
  }

  buildRelations(
    options: IGetPortfolioImageRelationsOptions,
  ): FindOptionsRelations<PortfolioImageEntity> {
    const relations: FindOptionsRelations<PortfolioImageEntity> = {};

    if (options.portfolio && options.portfolio === true) {
      relations.portfolio = options.portfolio;
    }

    return relations;
  }
}
