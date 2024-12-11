import { AutoMap } from '@automapper/classes';
import { Base } from 'src/app/base.entity';
import { Branch } from 'src/branch/branch.entity';
import { Order } from 'src/order/order.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity('table_tbl')
export class Table extends Base {
  @AutoMap()
  @Column({ name: 'name_column' })
  name: string;

  @AutoMap()
  @Column({ name: 'location_column', nullable: true })
  location?: string;

  @ManyToOne(() => Branch, (branch) => branch.tables)
  @JoinColumn({ name: 'branch_column' })
  branch: Branch;

  @Column({ name: 'x_position_column', nullable: true })
  @AutoMap()
  xPosition?: number;

  @Column({ name: 'y_position_column', nullable: true })
  @AutoMap()
  yPosition?: number;

  @AutoMap()
  @Column({ name: 'status_column' })
  status: string;

  @OneToMany(() => Order, (order) => order.table)
  orders: Order[];
}
