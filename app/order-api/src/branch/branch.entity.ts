import { Entity, Column, OneToMany } from 'typeorm';
import { Base } from 'src/app/base.entity';
import { AutoMap } from '@automapper/classes';
import { Menu } from 'src/menu/menu.entity';
import { Table } from 'src/table/table.entity';

@Entity('branch_tbl')
export class Branch extends Base {
  @AutoMap()
  @Column({ name: 'name_column' })
  name: string;

  @AutoMap()
  @Column({ name: 'address_column' })
  address: string;

  // one to many with menu
  @OneToMany(() => Menu, (menu) => menu.branch)
  menus: Menu[];

  // one to many with table
  @OneToMany(() => Table, (table) => table.branch)
  tables: Table[];
}
