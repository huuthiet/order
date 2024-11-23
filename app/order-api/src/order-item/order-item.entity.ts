import { AutoMap } from "@automapper/classes";
import { Base } from "src/app/base.entity";
import { Order } from "src/order/order.entity";
import { Variant } from "src/variant/variant.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";

@Entity('order_item_tbl')
export class OrderItem extends Base {
  @AutoMap()
  @Column({ name: 'quantity_column' })
  quantity: number;

  @AutoMap()
  @Column({ name: 'subtotal_column' })
  subtotal: number;

  @AutoMap()
  @Column({ name: 'note_column', nullable: true })
  note: string;

  // many to one with order
  @ManyToOne(() => Order, (order) => order.orderItems)
  @JoinColumn({ name: 'order_column' })
  order: Order;

  // many to one with variant 
  @ManyToOne(() => Variant, (variant) => variant.orderItems)
  @JoinColumn({ name: 'variant_column' })
  variant: Variant;
}