import { PartialType } from '@nestjs/swagger';

import { CreatePortfolioImageDto } from '@/portfolios/dto/create-portfolio-image.dto';

export class UpdatePortfolioImageDto extends PartialType(
  CreatePortfolioImageDto,
) {}
