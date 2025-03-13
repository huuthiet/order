import { Inject, Injectable, Logger } from '@nestjs/common';
import { CreatePermissionDto, PermissionResponseDto } from './permission.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { Permission } from './permission.entity';
import { In, Repository } from 'typeorm';
import { Role } from 'src/role/role.entity';
import { RoleException } from 'src/role/role.exception';
import { RoleValidation } from 'src/role/role.validation';
import { Authority } from 'src/authority/authority.entity';
import { TransactionManagerService } from 'src/db/transaction-manager.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Authority)
    private readonly authorityRepository: Repository<Authority>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @Inject(WINSTON_MODULE_NEST_PROVIDER)
    private readonly logger: Logger,
    @InjectMapper()
    private readonly mapper: Mapper,
    private readonly transactionMaangerService: TransactionManagerService,
  ) {}

  async create(createPermissionDto: CreatePermissionDto) {
    const context = `${PermissionService.name}.${this.create.name}`;
    const role = await this.roleRepository.findOne({
      where: {
        slug: createPermissionDto.role,
      },
    });
    if (role) throw new RoleException(RoleValidation.ROLE_NOT_FOUND);

    const authorities = await this.authorityRepository.findBy({
      slug: In([...createPermissionDto.authorities]),
    });

    const permission = this.mapper.map(
      createPermissionDto,
      CreatePermissionDto,
      Permission,
    );
    Object.assign(permission, {
      role,
      authorities,
    });

    const createdPermission =
      await this.transactionMaangerService.execute<Permission>(
        async (manager) => {
          return await manager.save(permission);
        },
        (result) => {
          this.logger.log(
            `Permission ${result.id} created successfully`,
            context,
          );
        },
        (error) => {
          this.logger.error(
            `Failed to create permission: ${error.message}`,
            error.stack,
            context,
          );
          throw new Error('Failed to create permission');
        },
      );

    return this.mapper.map(
      createdPermission,
      Permission,
      PermissionResponseDto,
    );
  }

  async remove(slug: string) {
    const context = `${PermissionService.name}.${this.remove.name}`;
    const permission = await this.permissionRepository.findOne({
      where: {
        slug,
      },
    });
    if (!permission) throw new Error('Permission not found');

    const result = await this.transactionMaangerService.execute<Permission>(
      async (manager) => {
        return await manager.remove(permission);
      },
      () => {
        this.logger.log(`Permission ${slug} removed successfully`, context);
      },
      (error) => {
        this.logger.error(
          `Failed to remove permission: ${error.message}`,
          error.stack,
          context,
        );
        throw new Error('Failed to remove permission');
      },
    );

    return this.mapper.map(result, Permission, PermissionResponseDto);
  }
}
