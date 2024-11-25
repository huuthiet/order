import { AutoMap } from '@automapper/classes';
import { Base } from 'src/app/base.entity';
import { Branch } from 'src/branch/branch.entity';
import { OrderItem } from 'src/order-item/order-item.entity';
import { User } from 'src/user/user.entity';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { OrderStatus } from './order.contants';
import { Payment } from 'src/payment/payment.entity';

@Entity('order_tbl')
export class Order extends Base {
  @AutoMap()
  @Column({ name: 'subtotal_column' })
  subtotal: number;

  @AutoMap()
  @Column({ name: 'status_column', default: OrderStatus.PENDING })
  status: string;

  @AutoMap()
  @Column({ name: 'type_column' })
  type: string;

  @AutoMap()
  @Column({ name: 'table_name_column', nullable: true })
  tableName?: string;

  // many to one with branch
  @ManyToOne(() => Branch, (branch) => branch.orders)
  @JoinColumn({ name: 'branch_column' })
  branch: Branch;

  // many to one with user (owner)
  @ManyToOne(() => User, (user) => user.ownerOrders)
  @JoinColumn({ name: 'owner_column' })
  owner: User;

  // many to one with user (approval order)
  @ManyToOne(() => User, (user) => user.approvalOrders, { nullable: true })
  @JoinColumn({ name: 'approval_by_column' })
  approvalBy?: User;

  // one to many with order item
  @OneToMany(() => OrderItem, (orderItem) => orderItem.order, {
    cascade: ['insert', 'update'],
  })
  orderItems: OrderItem[];

  // Many to one with payment
  @ManyToOne(() => Payment, (payment) => payment.orders)
  @JoinColumn({ name: 'payment_column' })
  @AutoMap(() => Payment)
  payment: Payment;
}
