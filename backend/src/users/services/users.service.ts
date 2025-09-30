import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { verify } from 'argon2';
import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';

import {
  IUserDataCreation,
  IUserDataRemoving,
  IGetOneUserOptions,
  IUserDataUpdate,
  IGetUserFilterOptions,
} from '@/users/interfaces/user.service.interfaces';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '@/users/entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private repository: Repository<UserEntity>,
  ) {}

  async create(data: IUserDataCreation) {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async update(data: IUserDataUpdate) {
    const { id, ...updateData } = data;

    const res = await this.repository
      .createQueryBuilder('user')
      .update(UserEntity)
      .set(updateData)
      .where('id = :id', { id })
      .returning('*')
      .execute();

    if (res.affected == 0) throw new ForbiddenException('Permission error');
    return;
  }

  async remove({ id, password }: IUserDataRemoving) {
    const user = await this.getOne({ id });
    if (!user) throw new NotFoundException('User not found');
    const verifyPass = await verify(user.password, password);
    if (!verifyPass) throw new BadRequestException('Wrong password');
    await this.repository.delete(id);
  }

  async getOne(options: IGetOneUserOptions) {
    const findOneOptions: FindOneOptions<UserEntity> = {};
    findOneOptions.where = this.getFilter(options);
    return await this.repository.findOne(findOneOptions);
  }

  async checkUserEmailExists(email: string) {
    const user = await this.getOne({ email });
    if (user) throw new BadRequestException('User email already exist');
    return;
  }

  getFilter(options: IGetUserFilterOptions): FindOptionsWhere<UserEntity> {
    const filter: FindOptionsWhere<UserEntity> = {};

    if (options.id != null) filter.id = options.id;
    if (options.email != null) filter.email = options.email;

    return filter;
  }
}
