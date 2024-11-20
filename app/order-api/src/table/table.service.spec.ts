import { Test, TestingModule } from '@nestjs/testing';
import { TableService } from './table.service';
import { MockType, repositoryMockFactory } from 'src/test-utils/repository-mock.factory';
import { Repository } from 'typeorm';
import { Table } from './table.entity';
import { Branch } from 'src/branch/branch.entity';
import { Mapper } from '@automapper/core';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mapperMockFactory } from 'src/test-utils/mapper-mock.factory';

describe('TableService', () => {
  const mapperProvider = 'automapper:nestjs:default';
  let service: TableService;
  let tableRepositoryMock: MockType<Repository<Table>>;
  let branchRepositoryMock: MockType<Repository<Branch>>;
  let mapperMock: MockType<Mapper>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TableService,
        {
          provide: getRepositoryToken(Table),
          useFactory: repositoryMockFactory
        },
        {
          provide: getRepositoryToken(Branch),
          useFactory: repositoryMockFactory
        },
        {
          provide: mapperProvider,
          useFactory: mapperMockFactory
        },
      ],
    }).compile();

    service = module.get<TableService>(TableService);
    tableRepositoryMock = module.get(getRepositoryToken(Table));
    branchRepositoryMock = module.get(getRepositoryToken(Branch));
    mapperMock = module.get(mapperProvider);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
