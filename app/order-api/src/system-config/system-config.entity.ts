import { AutoMap } from '@automapper/classes';
import { Base } from 'src/app/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('system_config_tbl')
export class SystemConfig extends Base {
  @Column({ name: 'key_column', unique: true })
  @AutoMap()
  key: string;

  @Column({ name: 'value_column', unique: true })
  @AutoMap()
  value: string;

  @Column({ name: 'description_column', nullable: true, type: 'text' })
  @AutoMap()
  description?: string;
}
