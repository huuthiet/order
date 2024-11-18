import { Test, TestingModule } from '@nestjs/testing';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { MAPPER_MODULE_PROVIDER } from 'src/app/app.constants';

describe('BranchController', () => {
  let controller: BranchController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BranchController],
      providers: [
        BranchService,
        {
          provide: MAPPER_MODULE_PROVIDER,
          useValue: {},
        },
        {
          provide: getRepositoryToken(Branch),
          useValue: {},
        },
      ],
    }).compile();

    controller = module.get<BranchController>(BranchController);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
