import { AutoMap } from '@automapper/classes';
import { Base } from 'src/app/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('file_tbl')
export class File extends Base {
  @Column({ name: 'name_column', unique: true })
  @AutoMap()
  name: string;

  @Column({ name: 'extension_column' })
  @AutoMap()
  extension: string;

  @Column({ name: 'mimetype_column' })
  @AutoMap()
  mimetype: string;

  @Column({ type: 'longtext', name: 'data_column' })
  @AutoMap()
  data: string;

  @Column({ name: 'size_column', nullable: true })
  @AutoMap()
  size: number;
}
