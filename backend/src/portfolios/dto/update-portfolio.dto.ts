import { PartialType } from '@nestjs/swagger';

import { CreatePortfolioDto } from '@/portfolios/dto/create-portfolio.dto';

export class UpdatePortfolioDto extends PartialType(CreatePortfolioDto) {}
