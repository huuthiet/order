import { Base } from 'src/app/base.entity';
import { Authority } from 'src/authority/authority.entity';
import { Role } from 'src/role/role.entity';
import { Entity, JoinColumn, ManyToOne } from 'typeorm';

@Entity({ name: 'permission_tbl' })
export class Permission extends Base {
  @ManyToOne(() => Role, (role) => role.permissions)
  @JoinColumn({ name: 'role_column' })
  role: Role;

  @ManyToOne(() => Authority, (a) => a.permissions)
  @JoinColumn({ name: 'authority_column' })
  authority: Authority;
}
