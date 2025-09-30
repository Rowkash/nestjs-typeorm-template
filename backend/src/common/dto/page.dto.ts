import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, Max, Min } from 'class-validator';

export enum OrderSortEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export class PageDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @IsInt()
  @Min(1)
  @IsOptional()
  @Type(() => Number)
  readonly page?: number;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 500,
    default: 10,
  })
  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  @Type(() => Number)
  readonly limit?: number;

  @ApiPropertyOptional({ default: OrderSortEnum.DESC, enum: OrderSortEnum })
  @IsOptional()
  @IsEnum(OrderSortEnum)
  @Type(() => String)
  readonly orderSort?: string = OrderSortEnum.DESC;
}
