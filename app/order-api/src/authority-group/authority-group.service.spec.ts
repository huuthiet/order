import { Test, TestingModule } from '@nestjs/testing';
import { AuthorityGroupService } from './authority-group.service';

describe('AuthorityGroupService', () => {
  let service: AuthorityGroupService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthorityGroupService],
    }).compile();

    service = module.get<AuthorityGroupService>(AuthorityGroupService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
