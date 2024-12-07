import { Inject, Injectable, Logger } from '@nestjs/common';
import { Timeout } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { Repository } from 'typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { RoleEnum } from './role.enum';
import * as _ from 'lodash';
import { INIT_ROLES_JOB } from './role.constant';

@Injectable()
export class RoleScheduler {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Timeout(INIT_ROLES_JOB, 1000) // Called once after 1 second
  async initRoles() {
    const context = `${RoleScheduler.name}.${this.initRoles.name}`;
    this.logger.log(`Initializing roles...`, context);

    const existingRoles = await this.roleRepository.find({
      select: ['name'], // Fetch only the names to minimize data load
    });

    // Identify missing roles
    const missingRoles = Object.values(RoleEnum)
      .filter((role) => !existingRoles.some((item) => item.name === role))
      .map((role) => {
        const newRole = new Role();
        Object.assign(newRole, {
          name: role,
          description: role,
        } as Role);
        return newRole;
      });

    if (_.isEmpty(missingRoles)) {
      this.logger.log('No missing roles. Initialization skipped.', context);
      return;
    }

    this.roleRepository.manager.transaction(async (manager) => {
      try {
        await manager.save(missingRoles);
        this.logger.log(
          `Missing roles created: ${missingRoles.map((r) => r.name).join(', ')}`,
          context,
        );
      } catch (error) {
        this.logger.error(
          `Error when initializing roles: ${error.message}`,
          context,
        );
      }
    });
  }
}
