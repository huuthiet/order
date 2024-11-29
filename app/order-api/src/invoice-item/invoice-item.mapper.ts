import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, extend, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { baseMapper } from 'src/app/base.mapper';
import { InvoiceItem } from './invoice-item.entity';
import { InvoiceItemResponseDto } from './invoice-item.dto';

@Injectable()
export class InvoiceItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        InvoiceItem,
        InvoiceItemResponseDto,
        extend(baseMapper(mapper)),
      );
      // createMap(mapper, Menu, MenuResponseDto, extend(baseMapper(mapper)));
      // createMap(mapper, CreateMenuDto, Menu);
    };
  }
}
