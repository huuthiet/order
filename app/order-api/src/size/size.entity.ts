import { Entity, Column, OneToMany } from 'typeorm';
import { AutoMap } from '@automapper/classes';

import { Base } from "src/app/base.entity";
import { Variant } from "src/variant/variant.entity";

@Entity("size_tbl")
export class Size extends Base {
  @AutoMap()
  @Column({ name: "name_column" })
  name: string;

  @AutoMap()
  @Column({ name: "description_column", nullable: true })
  description?: string;

  @OneToMany(() => Variant, (variant) => variant.size)
  variants: Variant[];
}