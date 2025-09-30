import { getQueueToken } from '@nestjs/bullmq';
import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { QueueEnum } from '@/bull/enums/queue.enum';
import { MinioService } from '@/minio/services/minio.service';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { PortfolioImagesService } from '@/portfolios/services/portfolio-images.service';
import {
  IGetPortfolioImageFilterOptions,
  IGetPortfolioImageRelationsOptions,
} from '@/portfolios/interfaces/portfolio-images.service.interfaces';
import { getRepositoryToken } from '@nestjs/typeorm';
import { PortfolioImageEntity } from '@/portfolios/entities/portfolio-image.entity';

describe('PortfolioImagesService', () => {
  let portfolioImagesService: PortfolioImagesService;

  const mockMinIoConfig = {
    endpoint: 'http://localhost:9000',
    bucketName: 'storage',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: getRepositoryToken(PortfolioImageEntity),
          useValue: {},
        },
        PortfolioImagesService,
        { provide: PortfoliosService, useValue: {} },
        { provide: MinioService, useValue: {} },
        {
          provide: ConfigService,
          useValue: { get: jest.fn().mockReturnValue(mockMinIoConfig) },
        },
        {
          provide: getQueueToken(QueueEnum.MEDIA_PROCESSING_QUEUE),
          useValue: {},
        },
      ],
    }).compile();

    portfolioImagesService = module.get(PortfolioImagesService);
  });

  it('should be defined', () => {
    expect(PortfolioImagesService).toBeDefined();
  });

  describe('getImagePathFromS3()', () => {
    const { endpoint, bucketName } = mockMinIoConfig;
    it.each`
      payload                                   | expectedResult
      ${'eb0f7d63-974c-4b79-87cf-f1e154c8ec36'} | ${`${endpoint}/${bucketName}/eb0f7d63-974c-4b79-87cf-f1e154c8ec36`}
      ${'ac8f81cf-5e10-4a0b-b7e7-e5049cd4d701'} | ${`${endpoint}/${bucketName}/ac8f81cf-5e10-4a0b-b7e7-e5049cd4d701`}
    `(
      'should return correct image path $payload',
      ({ payload, expectedResult }) => {
        const result = portfolioImagesService.getImagePathFromS3(
          payload as string,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });

  describe('buildWhere()', () => {
    it.each`
      payload                          | expectedResult
      ${{}}                            | ${{}}
      ${{ id: 123 }}                   | ${{ id: 123 }}
      ${{ portfolioId: 222 }}          | ${{ portfolioId: 222 }}
      ${{ id: 333, portfolioId: 444 }} | ${{ id: 333, portfolioId: 444 }}
    `('should return correct where $payload', ({ payload, expectedResult }) => {
      const result = portfolioImagesService.buildWhere(
        payload as IGetPortfolioImageFilterOptions,
      );
      expect(result).toEqual(expectedResult);
    });
  });

  describe('buildRelations()', () => {
    it.each`
      payload                | expectedResult
      ${{}}                  | ${{}}
      ${{ portfolio: true }} | ${{ portfolio: true }}
      ${{ portfolio: 123 }}  | ${{}}
    `(
      'should return correct relations $payload',
      ({ payload, expectedResult }) => {
        const result = portfolioImagesService.buildRelations(
          payload as IGetPortfolioImageRelationsOptions,
        );
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
