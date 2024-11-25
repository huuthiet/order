import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './user.entity';
import { repositoryMockFactory } from 'src/test-utils/repository-mock.factory';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMockFactory,
        },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useValue: mapperMockFactory,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
