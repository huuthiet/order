import { Test, TestingModule } from '@nestjs/testing';
import { ProductAnalysisController } from './product-analysis.controller';
import { ProductAnalysisService } from './product-analysis.service';

describe('ProductAnalysisController', () => {
  let controller: ProductAnalysisController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductAnalysisController],
      providers: [ProductAnalysisService],
    }).compile();

    controller = module.get<ProductAnalysisController>(ProductAnalysisController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
