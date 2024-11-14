import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import {
  createMap,
  extend,
  forMember,
  Mapper,
  mapWith,
} from '@automapper/core';
import { Injectable } from '@nestjs/common';

import { CreateProductRequestDto, ProductResponseDto } from './product.dto';
import { Product } from './product.entity';
import { baseMapper } from 'src/app/base.mapper';
import { CatalogResponseDto } from 'src/catalog/catalog.dto';
import { Catalog } from 'src/catalog/catalog.entity';
import { VariantResponseDto } from 'src/variant/variant.dto';
import { Variant } from 'src/variant/variant.entity';

@Injectable()
export class ProductProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      // Map entity to response
      createMap(
        mapper,
        Product,
        ProductResponseDto,
        forMember(
          (destination) => destination.catalog,
          mapWith(CatalogResponseDto, Catalog, (source) => source.catalog),
        ),
        forMember(
          (destination) => destination.variants,
          mapWith(VariantResponseDto, Variant, (source) => source.variants),
        ),
        extend(baseMapper(mapper)),
      );

      // Map request object to entity
      createMap(mapper, CreateProductRequestDto, Product);
    };
  }
}
