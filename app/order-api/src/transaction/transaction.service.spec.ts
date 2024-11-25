import { Test, TestingModule } from '@nestjs/testing';
import { TransactionService } from './transaction.service';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

describe('TransactionService', () => {
  let service: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: WINSTON_MODULE_NEST_PROVIDER,
          useValue: console,
        },
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
