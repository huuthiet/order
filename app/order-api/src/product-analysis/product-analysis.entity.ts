import { AutoMap } from '@automapper/classes';
import { Base } from 'src/app/base.entity';
import { Branch } from 'src/branch/branch.entity';
import { Product } from 'src/product/product.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('product_analysis_tbl')
export class ProductAnalysis extends Base {
  @AutoMap(() => Branch)
  @ManyToOne(() => Branch, (b) => b.productAnalyses, {})
  @JoinColumn({ name: 'branch_column' })
  branch: Branch;

  @AutoMap()
  @Column({ name: 'order_date_column' })
  orderDate: Date;

  @AutoMap(() => Product)
  @ManyToOne(() => Product, (p) => p.productAnalyses, {})
  @JoinColumn({ name: 'product_column' })
  product: Product;

  @AutoMap()
  @Column({ name: 'total_quantity_column' })
  totalQuantity: number;
}
