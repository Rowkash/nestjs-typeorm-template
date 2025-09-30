import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PageDto } from '@/common/dto/page.dto';

export enum PortfolioPageSortByEnum {
  CREATED_AT = 'createdAt',
  NAME = 'name',
}

export class PortfolioPageDto extends PageDto {
  @ApiPropertyOptional({
    example: 'My portfolio',
    description: 'Portfolio name filter',
  })
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    enum: PortfolioPageSortByEnum,
    default: PortfolioPageSortByEnum.CREATED_AT,
  })
  @IsOptional()
  @IsEnum(PortfolioPageSortByEnum)
  readonly sortBy?: string = PortfolioPageSortByEnum.CREATED_AT;
}
