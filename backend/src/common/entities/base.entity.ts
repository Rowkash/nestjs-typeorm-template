import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

export abstract class BaseEntity {
  @ApiProperty({ example: 1, description: 'Unique ID' })
  @Expose()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Timestamps of entity create',
    example: '2023-01-13T08:48:08.089Z',
  })
  @Expose()
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Timestamps of entity update',
    example: '2023-01-13T08:48:08.089Z',
  })
  @Exclude()
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
