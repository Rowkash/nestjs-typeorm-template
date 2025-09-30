import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import type { Relation } from 'typeorm';

import { BaseEntity } from '@/common/entities/base.entity';
import { PortfolioEntity } from '@/portfolios/entities/portfolio.entity';
import { PortfolioImageStatus } from '@/portfolios/enums/portfolio-image-status.enum';

@Entity({ name: 'images' })
export class PortfolioImageEntity extends BaseEntity {
  @ApiProperty({ example: 'My Portfolio', description: `Portfolio's name` })
  @Expose()
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    example: 'This is my Portfolio image',
    description: `Portfolio image description`,
  })
  @Expose()
  @Column({ nullable: false })
  description: string;

  @ApiProperty({
    example: '55669cac-0213-4388-9b26-4b275643e653.jpeg',
    description: `Image file name`,
  })
  @Exclude()
  @Column({ nullable: false, name: 'file_name' })
  fileName: string;

  @ApiProperty({
    example:
      'http://localhost:9000/storage/a74378d9-251d-4447-a669-74e8c5f8cc9a',
    description: `Image url`,
  })
  @Expose()
  @Column({ default: null })
  url: string;

  @ApiProperty({ enum: PortfolioImageStatus, description: `Portfolio status` })
  @Expose()
  @Column({
    nullable: false,
    type: 'enum',
    enum: PortfolioImageStatus,
    default: PortfolioImageStatus.PENDING,
  })
  status: PortfolioImageStatus;

  @ApiProperty({ type: () => PortfolioEntity })
  @Expose()
  @Type(() => PortfolioEntity)
  @ManyToOne(() => PortfolioEntity, (portfolio) => portfolio.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'portfolio_id' })
  portfolio: Relation<PortfolioEntity>;

  @ApiProperty({ example: 1, description: 'Portfolio ID' })
  @Column({ name: 'portfolio_id' })
  portfolioId: number;
}
