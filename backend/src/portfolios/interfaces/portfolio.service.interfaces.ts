export interface IPortfolioDataCreation {
  name: string;
  description: string;
  userId: number;
}

export interface IPortfolioDataUpdate {
  portfolioId: number;
  userId: number;
  name?: string;
  description?: string;
}

export interface IGetPortfolioFilterOptions {
  id?: number;
  name?: string;
  userId?: number;
}

export interface IGetPortfolioRelationsOptions {
  images?: boolean;
}

export interface IGetOnePortfolioOptions {
  id?: number;
  userId?: number;
  relations?: IGetPortfolioRelationsOptions;
}
