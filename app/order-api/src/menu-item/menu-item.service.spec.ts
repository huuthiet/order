import { Test, TestingModule } from '@nestjs/testing';
import { MenuItemService } from './menu-item.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MenuItem } from './menu-item.entity';
import { repositoryMockFactory } from 'src/test-utils/repository-mock.factory';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';

describe('MenuItemService', () => {
  let service: MenuItemService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MenuItemService,
        {
          provide: getRepositoryToken(MenuItem),
          useFactory: repositoryMockFactory,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console, // Mock logger (or a custom mock)
        },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useValue: mapperMockFactory,
        },
      ],
    }).compile();

    service = module.get<MenuItemService>(MenuItemService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
