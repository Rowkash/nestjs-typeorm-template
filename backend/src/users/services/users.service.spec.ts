import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { UserEntity } from '@/users/entities/user.entity';
import { UsersService } from '@/users/services/users.service';
import { IGetUserFilterOptions } from '@/users/interfaces/user.service.interfaces';

describe('UsersService', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useValue: {},
        },
      ],
    }).compile();

    usersService = module.get(UsersService);
  });

  it('should be defined', () => {
    expect(UsersService).toBeDefined();
  });

  describe('getFilter()', () => {
    it.each`
      payload                                   | expectedResult
      ${{}}                                     | ${{}}
      ${{ id: 123 }}                            | ${{ id: 123 }}
      ${{ email: 'example@mail.com' }}          | ${{ email: 'example@mail.com' }}
      ${{ id: 123, email: 'example@mail.com' }} | ${{ id: 123, email: 'example@mail.com' }}
    `(
      'should return correct filter $payload',
      ({ payload, expectedResult }) => {
        const result = usersService.getFilter(payload as IGetUserFilterOptions);
        expect(result).toEqual(expectedResult);
      },
    );
  });
});
