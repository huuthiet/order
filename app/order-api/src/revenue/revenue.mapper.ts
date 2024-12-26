import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  extend,
  forMember,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { RevenueQueryResponseDto, RevenueResponseDto } from './revenue.dto';
import { Revenue } from './revenue.entity';
import { baseMapper } from 'src/app/base.mapper';

@Injectable()
export class RevenueProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        RevenueQueryResponseDto,
        Revenue,
        forMember(
          (destination) => destination.totalAmount,
          mapFrom((source) => +source.totalAmount),
        ),
        forMember(
          (destination) => destination.totalOrder,
          mapFrom((source) => +source.totalOrder),
        ),
      );

      createMap(
        mapper,
        Revenue,
        RevenueResponseDto,
        extend(baseMapper(mapper)),
      );
    };
  }
}
