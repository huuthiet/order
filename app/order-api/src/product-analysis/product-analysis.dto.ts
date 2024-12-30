import { AutoMap } from '@automapper/classes';

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
