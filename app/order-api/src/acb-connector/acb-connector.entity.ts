import { AutoMap } from '@automapper/classes';
import { IsNotEmpty } from 'class-validator';
import { Base } from 'src/app/base.entity';
import { Column, Entity } from 'typeorm';

@Entity('acb_connector_config_tbl')
export class ACBConnectorConfig extends Base {
  @AutoMap()
  @Column({ name: 'x_provider_id_column', nullable: true })
  @IsNotEmpty()
  xProviderId: string;

  @AutoMap()
  @Column({ name: 'x_service_column', nullable: true })
  @IsNotEmpty()
  xService: string;

  @AutoMap()
  @Column({ name: 'x_owner_number_column', nullable: true })
  @IsNotEmpty()
  xOwnerNumber: string;

  @AutoMap()
  @Column({ name: 'x_owner_type_column', nullable: true })
  @IsNotEmpty()
  xOwnerType: string;

  @AutoMap()
  @Column({ name: 'beneficiary_name_column', nullable: true })
  @IsNotEmpty()
  beneficiaryName: string;

  @AutoMap()
  @Column({ name: 'virtual_account_prefix_column', nullable: true })
  @IsNotEmpty()
  virtualAccountPrefix: string;
}
