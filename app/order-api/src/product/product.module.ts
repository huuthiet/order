import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { Product } from './product.entity';
import { ProductProfile } from './product.mapper';
import { Variant } from 'src/variant/variant.entity';
import { Catalog } from 'src/catalog/catalog.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Variant, Catalog]),
  ],
  controllers: [ProductController],
  providers: [
    ProductService,
    ProductProfile,
  ],
  exports: [ProductService]
})
export class ProductModule{}