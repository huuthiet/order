import { AutoMap } from '@automapper/classes';
import { Base } from 'src/app/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('payment_tbl')
export class Payment extends Base {
  @AutoMap()
  @Column({ name: 'amount_column' })
  amount: number;

  @AutoMap()
  @Column({ name: 'message_column' })
  message: string;

  @AutoMap()
  @Column({ name: 'status_code_column' })
  statusCode: string;

  @AutoMap()
  @Column({ name: 'status_message_column' })
  statusMessage: string;

  @AutoMap()
  @Column({ name: 'user_id_column' })
  userId: string;

  @AutoMap()
  @Column({ name: 'transaction_id_column' })
  transactionId: string;
}
