import { FindOptionsOrder } from 'typeorm';

import { PageDto } from '@/common/dto/page.dto';

export class SortingDbHelper<T> {
  readonly sortBy: string;
  readonly orderSort: string;

  constructor(partial: Partial<PageDto>) {
    Object.assign(this, partial);
  }

  get orderBy(): FindOptionsOrder<T> {
    const allowedFields = ['createdAt'];
    const sortField = allowedFields.includes(this.sortBy)
      ? this.sortBy
      : 'createdAt';
    return { [sortField]: this.orderSort } as FindOptionsOrder<T>;
  }
}
