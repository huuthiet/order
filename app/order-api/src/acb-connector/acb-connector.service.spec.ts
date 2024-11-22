import { Test, TestingModule } from '@nestjs/testing';
import { AcbConnectorService } from './acb-connector.service';

describe('AcbConnectorService', () => {
  let service: AcbConnectorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AcbConnectorService],
    }).compile();

    service = module.get<AcbConnectorService>(AcbConnectorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
