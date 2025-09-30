import { Injectable, NotFoundException } from '@nestjs/common';

import { MinioService } from '@/minio/services/minio.service';
import {
  IGetOnePortfolioOptions,
  IGetPortfolioFilterOptions,
  IGetPortfolioRelationsOptions,
  IPortfolioDataCreation,
  IPortfolioDataUpdate,
} from '@/portfolios/interfaces/portfolio.service.interfaces';
import { PortfolioPageDto } from '@/portfolios/dto/portfolio-page.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { PortfolioEntity } from '@/portfolios/entities/portfolio.entity';
import {
  FindOneOptions,
  FindOptionsRelations,
  FindOptionsWhere,
  Like,
  Repository,
} from 'typeorm';
import { SortingDbHelper } from '@/common/helper/sorting.helper';

@Injectable()
export class PortfoliosService {
  constructor(
    private readonly storage: MinioService,
    @InjectRepository(PortfolioEntity)
    private readonly repository: Repository<PortfolioEntity>,
  ) {}

  async create(data: IPortfolioDataCreation) {
    const entity = this.repository.create(data);
    return await this.repository.save(entity);
  }

  async update(data: IPortfolioDataUpdate) {
    const { userId, portfolioId, ...updateData } = data;
    const res = await this.repository
      .createQueryBuilder('portfolio')
      .update(PortfolioEntity)
      .set(updateData)
      .where('id = :id', { id: portfolioId, userId })
      .returning('*')
      .execute();

    if (res.affected == 0) throw new NotFoundException('Portfolio not found');
    return res.raw[0];
  }

  async getPage(options: PortfolioPageDto) {
    const { limit = 20, page = 1 } = options;
    const sorting = new SortingDbHelper<PortfolioEntity>(options);
    const [models, count] = await this.repository.findAndCount({
      where: this.buildWhere(options),
      order: sorting.orderBy,
      relations: this.buildRelations({ images: true }),
      take: limit,
      skip: (page - 1) * limit,
    });

    return { models, count };
  }

  async findOne(options: IGetOnePortfolioOptions) {
    const findOptions: FindOneOptions<PortfolioEntity> = {
      where: this.buildWhere(options),
      relations: options.relations
        ? this.buildRelations(options.relations)
        : undefined,
    };
    const portfolio = await this.repository.findOne(findOptions);
    if (!portfolio) throw new NotFoundException('Portfolio not found');
    return portfolio;
  }

  async remove(id: number, userId: number) {
    const portfolio = await this.findOne({
      id,
      userId,
      relations: { images: true },
    });

    if (portfolio.images && portfolio.images.length > 0) {
      const fileNames = portfolio.images.map((image) => image.fileName);
      await this.storage.deleteFiles(fileNames);
    }

    await this.repository.delete(id);
  }

  buildWhere(
    options: IGetPortfolioFilterOptions,
  ): FindOptionsWhere<PortfolioEntity> {
    const where: FindOptionsWhere<PortfolioEntity> = {};

    if (options.id != null) where.id = options.id;
    if (options.userId != null) where.userId = options.userId;
    if (options.name != null) where.name = Like(`%${options.name}%`);

    return where;
  }

  buildRelations(
    options: IGetPortfolioRelationsOptions,
  ): FindOptionsRelations<PortfolioEntity> {
    const relations: FindOptionsRelations<PortfolioEntity> = {};

    if (options.images && options.images === true) {
      relations.images = options.images;
    }

    return relations;
  }
}
