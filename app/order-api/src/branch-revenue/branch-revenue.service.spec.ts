import { Test, TestingModule } from '@nestjs/testing';
import { BranchRevenueService } from './branch-revenue.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BranchRevenue } from './branch-revenue.entity';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';
import { Branch } from 'src/branch/branch.entity';
import { repositoryMockFactory } from 'src/test-utils/repository-mock.factory';
import { dataSourceMockFactory } from 'src/test-utils/datasource-mock.factory';
import { TransactionManagerService } from 'src/db/transaction-manager.service';
import { File } from 'src/file/file.entity';
import { DataSource } from 'typeorm';
import { BranchUtils } from 'src/branch/branch.utils';
import { FileService } from 'src/file/file.service';

describe('BranchRevenueService', () => {
  let service: BranchRevenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BranchRevenueService,
        TransactionManagerService,
        BranchUtils,
        FileService,
        { provide: DataSource, useFactory: dataSourceMockFactory },
        {
          provide: MAPPER_MODULE_PROVIDER,
          useValue: {},
        },
        {
          provide: getRepositoryToken(BranchRevenue),
          useValue: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(File),
          useValue: repositoryMockFactory,
        },
        {
          provide: getRepositoryToken(Branch),
          useValue: repositoryMockFactory,
        },
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console,
        },
      ],
    }).compile();

    service = module.get<BranchRevenueService>(BranchRevenueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
