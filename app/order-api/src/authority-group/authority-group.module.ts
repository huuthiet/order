import { Module } from '@nestjs/common';
import { AuthorityGroupService } from './authority-group.service';
import { AuthorityGroupController } from './authority-group.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthorityGroup } from './authority-group.entity';
import { AuthorityGroupProfile } from './authority-group.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([AuthorityGroup])],
  controllers: [AuthorityGroupController],
  providers: [AuthorityGroupService, AuthorityGroupProfile],
})
export class AuthorityGroupModule {}
