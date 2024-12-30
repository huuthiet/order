import { Base } from 'src/app/base.entity';
import { Branch } from 'src/branch/branch.entity';
import { Product } from 'src/product/product.entity';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity('product_analysis_tbl')
export class ProductAnalysis extends Base {
  @ManyToOne(() => Branch, (b) => b.productAnalyses, {})
  @JoinColumn({ name: 'branch_column' })
  branch: Branch;

  @Column({ name: 'order_date_column' })
  orderDate: Date;

  @ManyToOne(() => Product, (p) => p.productAnalyses, {})
  @JoinColumn({ name: 'product_column' })
  product: Product;

  @Column({ name: 'total_quantity_column' })
  totalQuantity: number;
}
