import { Module } from '@nestjs/common';
import { ProductAnalysisService } from './product-analysis.service';
import { ProductAnalysisController } from './product-analysis.controller';
import { ProductAnalysisScheduler } from './product-analysis.scheduler';
import { ProductAnalysisProfile } from './product-analysis.mapper';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductAnalysis } from './product-analysis.entity';
import { Branch } from 'src/branch/branch.entity';
import { Product } from 'src/product/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductAnalysis, Branch, Product])],
  controllers: [ProductAnalysisController],
  providers: [
    ProductAnalysisService,
    ProductAnalysisScheduler,
    ProductAnalysisProfile,
  ],
})
export class ProductAnalysisModule {}
