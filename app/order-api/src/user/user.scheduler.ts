import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { Cron, CronExpression, Timeout } from '@nestjs/schedule';
import { Role } from 'src/role/role.entity';
import { RoleEnum } from 'src/role/role.enum';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserScheduler {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: Logger,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_3AM)
  async updateUserRole() {
    const context = `${UserScheduler.name}.${this.updateUserRole.name}`;
    this.logger.log(`Update user role`, context);

    const usersWithoutRole = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.role', 'role')
      .where('role.id IS NULL')
      .getMany();

    this.logger.log(
      `Number of users without role: ${usersWithoutRole.length}`,
      context,
    );

    const role = await this.roleRepository.findOne({
      where: {
        name: RoleEnum.Customer,
      },
    });

    if (!role) {
      this.logger.warn(`Role ${RoleEnum.Customer} not found`);
      return;
    }

    const updatedUsers = usersWithoutRole.map((item) => {
      item.role = role;
      return item;
    });

    this.userRepository.manager.transaction(async (manager) => {
      await manager.save(updatedUsers);
    });
    this.logger.log(`Update user role successfully`, context);
  }

  // Create super user if not exist
  @Timeout(5000)
  async initSuperAdmin() {
    const context = `${UserScheduler.name}.${this.initSuperAdmin.name}`;
    this.logger.log(`Initializing super admin...`, context);

    const hasSuperAdmin = await this.userRepository.exists({
      where: {
        phonenumber: 'root',
      },
    });
    if (hasSuperAdmin) {
      this.logger.warn(`Super admin already existed...`, context);
      return;
    }

    const role = await this.roleRepository.findOne({
      where: {
        name: RoleEnum.SuperAdmin,
      },
    });
    if (!role) {
      this.logger.warn(`Role ${RoleEnum.SuperAdmin} not found`, context);
      return;
    }

    // Create supper admin
    const superAdmin = new User();
    const hashedPass = await bcrypt.hash('root', 10);
    Object.assign(superAdmin, {
      role,
      phonenumber: 'root',
      firstName: 'Super',
      lastName: 'Admin',
      password: hashedPass,
    } as User);
    try {
      await this.userRepository.save(superAdmin);
      this.logger.log(`Super admin root/root created successfuly`, context);
    } catch (error) {
      this.logger.error(
        `Error when creating super admin: ${error.message}`,
        context,
      );
    }
  }
}
