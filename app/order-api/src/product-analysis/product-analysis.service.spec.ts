import { Test, TestingModule } from '@nestjs/testing';
import { ProductAnalysisService } from './product-analysis.service';

describe('ProductAnalysisService', () => {
  let service: ProductAnalysisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductAnalysisService],
    }).compile();

    service = module.get<ProductAnalysisService>(ProductAnalysisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
