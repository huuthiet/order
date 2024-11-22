import { Test, TestingModule } from '@nestjs/testing';
import { AcbConnectorController } from './acb-connector.controller';

describe('AcbConnectorController', () => {
  let controller: AcbConnectorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AcbConnectorController],
    }).compile();

    controller = module.get<AcbConnectorController>(AcbConnectorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
