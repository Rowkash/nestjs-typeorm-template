import { PortfolioImageStatus } from '@/portfolios/enums/portfolio-image-status.enum';

export interface ICreatePortfolioImagePayload {
  name: string;
  description: string;
  userId: number;
  portfolioId: number;
  file: Express.Multer.File;
}

export interface IUpdatePortfolioImagePayload {
  id: number;
  userId: number;
  portfolioId: number;
  name?: string;
  description?: string;
  file?: Express.Multer.File;
  status?: PortfolioImageStatus;
  url?: string;
}

export interface IGetPortfolioImageFilterOptions {
  id?: number;
  portfolioId?: number;
}

export interface IGetPortfolioImageRelationsOptions {
  portfolio?: boolean;
}

export interface IGetOnePortfolioImageOptions {
  id?: number;
  name?: string;
  portfolioId?: number;
  userId?: number;
  relations?: IGetPortfolioImageRelationsOptions;
}

export interface IPortfolioImageDataRemoving {
  imageId: number;
  userId: number;
  portfolioId: number;
}
