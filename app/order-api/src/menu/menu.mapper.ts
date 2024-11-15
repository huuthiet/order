import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, extend, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { baseMapper } from 'src/app/base.mapper';
import { Menu } from './menu.entity';
import { CreateMenuDto, MenuResponseDto } from './menu.dto';

@Injectable()
export class MenuProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Menu, MenuResponseDto, extend(baseMapper(mapper)));
      createMap(mapper, CreateMenuDto, Menu);
    };
  }
}
