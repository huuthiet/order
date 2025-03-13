import { Test, TestingModule } from '@nestjs/testing';
import { AuthorityGroupController } from './authority-group.controller';
import { AuthorityGroupService } from './authority-group.service';

describe('AuthorityGroupController', () => {
  let controller: AuthorityGroupController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthorityGroupController],
      providers: [AuthorityGroupService],
    }).compile();

    controller = module.get<AuthorityGroupController>(AuthorityGroupController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
