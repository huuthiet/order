import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  extend,
  forMember,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { MenuItem } from './menu-item.entity';
import { CreateMenuItemDto, MenuItemResponseDto } from './menu-item.dto';
import { baseMapper } from 'src/app/base.mapper';
import { forEach } from 'lodash';

@Injectable()
export class MenuItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        CreateMenuItemDto,
        MenuItem,
        forMember(
          (d) => d.currentStock,
          mapFrom((s) => s.defaultStock),
        ),
      );
      createMap(
        mapper,
        MenuItem,
        MenuItemResponseDto,
        extend(baseMapper(mapper)),
      );
    };
  }
}
