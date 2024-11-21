import { Base } from 'src/app/base.entity';
import { Entity } from 'typeorm';

@Entity('payment_tbl')
export class Payment extends Base {}
