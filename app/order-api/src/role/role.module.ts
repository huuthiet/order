import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleScheduler } from './role.scheduler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './role.entity';
import { RoleProfile } from './role.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Role])],
  controllers: [RoleController],
  providers: [RoleService, RoleScheduler, RoleProfile],
})
export class RoleModule {}
