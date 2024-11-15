import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Base } from 'src/app/base.entity';
import { Size } from 'src/size/size.entity';
import { Product } from 'src/product/product.entity';
import { AutoMap } from '@automapper/classes';

@Entity('variant_tbl')
export class Variant extends Base {
  @AutoMap()
  @Column({ name: 'price_column' })
  price: number;

  @ManyToOne(() => Size, (size) => size.variants)
  @JoinColumn({ name: 'size_column' })
  size: Size;

  @ManyToOne(() => Product, (product) => product.variants)
  @JoinColumn({ name: 'product_column' })
  product: Product;
}
