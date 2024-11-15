import { Entity, Column } from 'typeorm';
import { Base } from 'src/app/base.entity';
import { AutoMap } from '@automapper/classes';

@Entity('user_tbl')
export class User extends Base {
  @AutoMap()
  @Column({ name: 'phonenumber_column' })
  phonenumber: string;

  @Column({ name: 'password_column' })
  password: string;

  @Column({ name: 'first_name_column' })
  @AutoMap()
  firstName: string;

  @Column({ name: 'last_name_column' })
  @AutoMap()
  lastName: string;

  @Column({ name: 'is_active_column', default: true })
  @AutoMap()
  isActive: boolean;

  @Column({ name: 'dob_column', nullable: true })
  @AutoMap()
  dob?: string;

  @AutoMap()
  @Column({ name: 'email_column', nullable: true })
  email?: string;

  @AutoMap()
  @Column({ name: 'address_column', nullable: true })
  address?: string;
}
