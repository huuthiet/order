import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, extend, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { CatalogResponseDto, CreateCatalogRequestDto } from './catalog.dto';
import { Catalog } from './catalog.entity';
import { baseMapper  } from 'src/app/base.mapper';


@Injectable()
export class CatalogProfile extends AutomapperProfile {
    constructor(@InjectMapper() mapper: Mapper) {
        super(mapper);
    }

    override get profile() {
        return (mapper) => {
            createMap(
                mapper, 
                Catalog, 
                CatalogResponseDto,
                extend(baseMapper(mapper))
            );

            createMap(
                mapper, 
                CreateCatalogRequestDto,
                Catalog
            );
        };
    }
}