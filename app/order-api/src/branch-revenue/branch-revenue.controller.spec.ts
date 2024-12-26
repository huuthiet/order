import { Test, TestingModule } from '@nestjs/testing';
import { BranchRevenueController } from './branch-revenue.controller';
import { BranchRevenueService } from './branch-revenue.service';

describe('BranchRevenueController', () => {
  let controller: BranchRevenueController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchRevenueController],
      providers: [BranchRevenueService],
    }).compile();

    controller = module.get<BranchRevenueController>(BranchRevenueController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
