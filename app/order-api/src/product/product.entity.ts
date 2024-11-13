import {
  Entity,
  Column,
  ManyToMany,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Base } from 'src/app/base.entity';
import { Catalog } from 'src/catalog/catalog.entity';
import { Variant } from 'src/variant/variant.entity';
import { AutoMap } from '@automapper/classes';
import { MenuItem } from 'src/menu/menu-item.entity';

@Entity('product_tbl')
export class Product extends Base {
  @AutoMap()
  @Column({ name: 'name_column' })
  name: string;

  @AutoMap()
  @Column({ name: 'description_column', nullable: true })
  description?: string;

  @AutoMap()
  @Column({ name: 'is_active_column', default: true })
  isActive: boolean;

  @AutoMap()
  @Column({ name: 'is_limit_column', default: true })
  isLimit: boolean;

  @AutoMap()
  @Column({ name: 'image_column', nullable: true })
  image?: string;

  @AutoMap()
  @Column({ name: 'rating_column', nullable: true })
  rating?: number;

  // many to one with catalog
  @ManyToOne(() => Catalog, (catalog) => catalog.products)
  @JoinColumn({ name: 'catalog_column' })
  catalog: Catalog;

  // one to many with product variant
  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];

  // one to many with menu item
  @OneToMany(() => MenuItem, (menuItem) => menuItem.product)
  menuItems: MenuItem[];
}
