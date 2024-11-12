import { Entity, Column, ManyToMany, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Base } from "src/app/base.entity";
import { Catalog } from "src/catalog/catalog.entity";
import { Variant } from "src/variant/variant.entity";
import { AutoMap } from '@automapper/classes';

@Entity("product_tbl")
export class Product extends Base {
  @AutoMap()
  @Column({ name: "name_column" })
  name: string;

  @AutoMap()
  @Column({ name: "description_column", nullable: true })
  description?: string;

  @AutoMap()
  @Column({ name: "is_active_column", default: true })
  isActive: boolean;

  @AutoMap()
  @Column({ name: "is_limit_column", default: true })
  isLimit: boolean;

  @AutoMap()
  @Column({ name: "image_column", nullable: true })
  image?: string;

  @AutoMap()
  @Column({ name: "rating_column", nullable: true })
  rating?: number;

  @ManyToOne(() => Catalog, (catalog) => catalog.products)
  @JoinColumn({ name: "catalog_column" })
  catalog: Catalog;

  @OneToMany(() => Variant, (variant) => variant.product)
  variants: Variant[];
}
