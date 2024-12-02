import { AutoMap } from '@automapper/classes';
import { Base } from 'src/app/base.entity';
import { InvoiceItem } from 'src/invoice-item/invoice-item.entity';
import { Order } from 'src/order/order.entity';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity('invoice_tbl')
export class Invoice extends Base {
  @AutoMap()
  @Column({ name: 'payment_method_column' })
  paymentMethod: string;

  @AutoMap()
  @Column({ name: 'amount_column' })
  amount: number;

  @AutoMap()
  @Column({ name: 'status_column' })
  status: string;

  @AutoMap()
  @Column({ name: 'logo_column' })
  logo: string;

  @AutoMap()
  @Column({ name: 'table_name_column' })
  tableName: string;

  @AutoMap()
  @Column({ name: 'branch_address_column' })
  branchAddress: string;

  @AutoMap()
  @Column({ name: 'cashier_column' })
  cashier: string;

  @AutoMap()
  @Column({ name: 'customer_column' })
  customer: string;

  //   One invoice can have many invoice items
  // Cascade insert here means if there is a new PostDetails InvoiceItem set
  // on this relation, it will be inserted automatically to the db when you save this Invoice entity
  @OneToMany(() => InvoiceItem, (invoiceItem) => invoiceItem.invoice, {
    cascade: ['insert', 'update'],
  })
  @AutoMap(() => InvoiceItem)
  invoiceItems: InvoiceItem[];

  // One to one with order
  @OneToOne(() => Order, (order) => order.invoice)
  order: Order;
}