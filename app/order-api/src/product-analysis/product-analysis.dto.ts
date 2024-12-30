import { AutoMap } from '@automapper/classes';
import { BranchResponseDto } from 'src/branch/branch.dto';
import { ProductResponseDto } from 'src/product/product.dto';

export class ProductAnalysisQueryDto {
  @AutoMap()
  branchId: string;

  @AutoMap()
  orderDate: Date;

  @AutoMap()
  productId: string;

  @AutoMap()
  totalProducts: number;
}

export class ProductAnalysisResponseDto {
  @AutoMap()
  totalQuantity: number;

  @AutoMap()
  orderDate: Date;

  @AutoMap(() => BranchResponseDto)
  branch: BranchResponseDto;

  @AutoMap(() => ProductResponseDto)
  product: ProductResponseDto;
}
