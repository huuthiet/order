import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';
import { repositoryMockFactory } from 'src/test-utils/repository-mock.factory';
import { User } from './user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UserController', () => {
  let controller: UserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
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

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
