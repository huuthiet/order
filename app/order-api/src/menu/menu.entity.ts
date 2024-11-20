import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Base } from 'src/app/base.entity';
import { AutoMap } from '@automapper/classes';
import { Branch } from 'src/branch/branch.entity';
import { MenuItem } from 'src/menu-item/menu-item.entity';

@Entity('menu_tbl')
export class Menu extends Base {
  @AutoMap()
  @Column({ name: 'day_column', nullable: true })
  day?: string;

  @AutoMap()
  @Column({ name: 'date_column' })
  date: Date;

  // Many to one with branch
  @AutoMap()
  @ManyToOne(() => Branch, (branch) => branch.menus)
  @JoinColumn({ name: 'branch_id_column' })
  branch: Branch;

  // one to many with menu item
  @OneToMany(() => MenuItem, (menuItem) => menuItem.menu)
  @AutoMap(() => MenuItem)
  menuItems: MenuItem[];
}
