import { Column, Entity, OneToMany } from 'typeorm';
import type { Relation } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

import { BaseEntity } from '@/common/entities/base.entity';
import { PortfolioEntity } from '@/portfolios/entities/portfolio.entity';

@Entity({ name: 'users' })
export class UserEntity extends BaseEntity {
  @ApiProperty({ example: 'Benjamin', description: 'User name' })
  @Expose()
  @Column({ nullable: false })
  name: string;

  @ApiProperty({ example: 'Franklin', description: 'User last name' })
  @Expose()
  @Column({ nullable: false })
  lastName: string;

  @ApiProperty({
    example: 'benfrank@protonmail.com',
    description: 'User email',
  })
  @Expose()
  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Exclude()
  @Column({ nullable: false })
  password: string;

  @ApiProperty({
    type: () => [PortfolioEntity],
    description: 'Portfolios array',
  })
  @Expose()
  @OneToMany(() => PortfolioEntity, (portfolio) => portfolio.user)
  portfolios: Relation<PortfolioEntity[]>;
}
