import { Test, TestingModule } from '@nestjs/testing';
import { TableController } from './table.controller';
import { TableService } from './table.service';

describe('TableController', () => {
  let controller: TableController;
  let service: TableService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TableController],
      providers: [
        TableService,
        {
          provide: TableService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            changeStatus: jest.fn(),
            update: jest.fn(),
            remove: jest.fn(),
          },
        }
      ],
    }).compile();

    controller = module.get<TableController>(TableController);
    service = module.get<TableService>(TableService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
