import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  extend,
  forMember,
  mapFrom,
  Mapper,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';

import {
  CatalogResponseDto,
  CreateCatalogRequestDto,
  UpdateCatalogRequestDto,
} from './catalog.dto';
import { Catalog } from './catalog.entity';
import { baseMapper } from 'src/app/base.mapper';

@Injectable()
export class CatalogProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(
        mapper,
        Catalog,
        CatalogResponseDto,
        extend(baseMapper(mapper)),
      );

      createMap(
        mapper,
        CreateCatalogRequestDto,
        Catalog,
        forMember(
          (destination) => destination.name,
          mapFrom((source) => source.name?.toLocaleLowerCase()),
        ),
      );

      createMap(
        mapper,
        UpdateCatalogRequestDto,
        Catalog,
        forMember(
          (destination) => destination.name,
          mapFrom((source) => source.name?.toLocaleLowerCase()),
        ),
      );
    };
  }
}
