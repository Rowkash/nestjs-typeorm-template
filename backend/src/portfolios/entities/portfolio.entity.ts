import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';

import { UserEntity } from '@/users/entities/user.entity';
import { BaseEntity } from '@/common/entities/base.entity';
import { PortfolioImageEntity } from '@/portfolios/entities/portfolio-image.entity';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'portfolios' })
export class PortfolioEntity extends BaseEntity {
  @ApiProperty({ example: 'My Portfolio', description: `Portfolio's name` })
  @Expose()
  @Column({ nullable: false })
  name: string;

  @ApiProperty({
    example: 'This is my Portfolio',
    description: `Portfolio's description`,
  })
  @Expose()
  @Column({ nullable: false })
  description: string;

  @ApiProperty({ type: () => UserEntity })
  @ManyToOne(() => UserEntity, (user) => user.portfolios)
  @JoinColumn({ name: 'user_id' })
  user: Relation<UserEntity>;

  @ApiProperty({ example: 5, description: 'User ID' })
  @Expose()
  @Column({ name: 'user_id' })
  userId: number;

  @ApiProperty({ type: () => UserEntity })
  @Expose()
  @Type(() => PortfolioImageEntity)
  @OneToMany(() => PortfolioImageEntity, (images) => images.portfolio)
  images: Relation<PortfolioImageEntity[]>;
}
