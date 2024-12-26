import { Test, TestingModule } from '@nestjs/testing';
import { BranchRevenueService } from './branch-revenue.service';

describe('BranchRevenueService', () => {
  let service: BranchRevenueService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BranchRevenueService],
    }).compile();

    service = module.get<BranchRevenueService>(BranchRevenueService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
