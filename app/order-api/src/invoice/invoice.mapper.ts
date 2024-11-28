import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, extend, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { baseMapper } from 'src/app/base.mapper';
import { InvoiceResponseDto } from './invoice.dto';
import { Invoice } from './invoice.entity';

@Injectable()
export class InvoiceProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Invoice,
        InvoiceResponseDto,
        extend(baseMapper(mapper)),
        // forMember(
        //   (d) => d.invoiceItems,
        //   mapWith(InvoiceItemResponseDto, InvoiceItem, (s) => s.invoiceItems),
        // ),
      );
    };
  }
}
