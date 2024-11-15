import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VariantController } from './variant.controller';
import { VariantService } from './variant.service';
import { Variant } from './variant.entity';
import { VariantProfile } from './variant.mapper';
import { SizeModule } from 'src/size/size.module';
import { ProductModule } from 'src/product/product.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Variant]),
    SizeModule,
    forwardRef(() => ProductModule)
  ],
  controllers: [VariantController],
  providers: [
    VariantService,
    VariantProfile,
  ],
  exports: [VariantService]
})
export class VariantModule{}