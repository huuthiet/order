import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, extend, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { baseMapper } from 'src/app/base.mapper';
import { Branch } from './branch.entity';
import { BranchResponseDto, CreateBranchDto } from './branch.dto';

@Injectable()
export class BranchProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Branch, BranchResponseDto, extend(baseMapper(mapper)));
      createMap(mapper, CreateBranchDto, Branch);
    };
  }
}
