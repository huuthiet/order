import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductAnalysis } from './product-analysis.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import {
  ProductAnalysisQueryDto,
  ProductAnalysisResponseDto,
} from './product-analysis.dto';
import { Product } from 'src/product/product.entity';
import { ProductException } from 'src/product/product.exception';
import ProductValidation from 'src/product/product.validation';
import { BranchException } from 'src/branch/branch.exception';
import { BranchValidation } from 'src/branch/branch.validation';
import { Branch } from 'src/branch/branch.entity';

@Injectable()
export class ProductAnalysisService {
  constructor(
    @InjectRepository(ProductAnalysis)
    private readonly productAnalysisRepository: Repository<ProductAnalysis>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectMapper()
    private readonly mapper: Mapper,
    @InjectRepository(Branch)
    private readonly branchRepository: Repository<Branch>,
  ) {}

  async getTopSellProductsByBranch(branchSlug: string) {
    // Get top 10 products that are the best seller base on specific branch
    const results: ProductAnalysisQueryDto[] =
      await this.productAnalysisRepository
        .createQueryBuilder('pa')
        .select('pa.product', 'productId') // Include the product id
        .addSelect('pa.branch', 'branchId') // Include branch id
        .addSelect('COUNT(pa.product)', 'totalProducts') // Count occurrences of each product
        .groupBy('pa.product') // Group by product
        .addGroupBy('pa.branch')
        .orderBy('totalProducts', 'DESC') // Order by count in descending order
        .limit(10) // Limit to top 10
        .getRawMany();

    const productAnalyses: ProductAnalysis[] = await Promise.all(
      results.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: {
            id: item.productId,
          },
        });
        if (!product)
          throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);
        const productAnalysis = this.mapper.map(
          item,
          ProductAnalysisQueryDto,
          ProductAnalysis,
        );

        const branch = await this.branchRepository.findOne({
          where: { id: item.branchId },
        });
        if (!branch)
          throw new BranchException(BranchValidation.BRANCH_NOT_FOUND);
        productAnalysis.product = product;
        productAnalysis.branch = branch;
        return productAnalysis;
      }),
    );

    return this.mapper.mapArray(
      productAnalyses,
      ProductAnalysis,
      ProductAnalysisResponseDto,
    );
  }

  async getTopSellProducts() {
    // Get top 10 products that are the best seller in all branch
    const results: ProductAnalysisQueryDto[] =
      await this.productAnalysisRepository
        .createQueryBuilder('pa')
        .select('pa.product', 'productId') // Include the product object
        .addSelect('COUNT(pa.product)', 'totalProducts') // Count occurrences of each product
        .groupBy('pa.product') // Group by product
        .orderBy('totalProducts', 'DESC') // Order by count in descending order
        .limit(10) // Limit to top 10
        .getRawMany();

    const productAnalyses: ProductAnalysis[] = await Promise.all(
      results.map(async (item) => {
        const product = await this.productRepository.findOne({
          where: {
            id: item.productId,
          },
        });
        if (!product)
          throw new ProductException(ProductValidation.PRODUCT_NOT_FOUND);
        const productAnalysis = this.mapper.map(
          item,
          ProductAnalysisQueryDto,
          ProductAnalysis,
        );
        productAnalysis.product = product;
        return productAnalysis;
      }),
    );

    return this.mapper.mapArray(
      productAnalyses,
      ProductAnalysis,
      ProductAnalysisResponseDto,
    );
  }
}
