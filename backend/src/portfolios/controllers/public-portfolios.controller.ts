import {
  Controller,
  Get,
  Param,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  ParseIntPipe,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { PortfolioPageDto } from '@/portfolios/dto/portfolio-page.dto';
import { PortfolioEntity } from '@/portfolios/entities/portfolio.entity';
import { PortfoliosService } from '@/portfolios/services/portfolios.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';

@ApiTags('Portfolios Public')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('public/portfolios')
export class PublicPortfoliosController {
  constructor(private readonly portfoliosService: PortfoliosService) {}

  @ApiOperation({ summary: 'Get portfolios page' })
  @SerializeOptions({ excludeExtraneousValues: true })
  @Get()
  async getPage(@Query() query: PortfolioPageDto) {
    const { models, count } = await this.portfoliosService.getPage(query);
    return {
      models: plainToInstance(PortfolioEntity, models, {
        excludeExtraneousValues: true,
      }),
      count,
    };
  }

  @ApiOperation({ summary: 'Get portfolio by id' })
  @ApiOkResponse({ type: PortfolioEntity })
  @UseGuards(JwtAuthGuard)
  @SerializeOptions({ excludeExtraneousValues: true })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) portfolioId: number) {
    const portfolio = await this.portfoliosService.findOne({
      id: portfolioId,
      relations: { images: true },
    });

    return plainToInstance(PortfolioEntity, portfolio, {
      excludeExtraneousValues: true,
    });
  }
}
