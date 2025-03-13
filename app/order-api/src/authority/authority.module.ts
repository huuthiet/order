import { Module } from '@nestjs/common';
import { AuthorityService } from './authority.service';
import { AuthorityController } from './authority.controller';
import { AuthorityScheduler } from './authority.scheduler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Authority } from './authority.entity';
import { AuthorityGroup } from 'src/authority-group/authority-group.entity';
import { DbModule } from 'src/db/db.module';

@Module({
  imports: [TypeOrmModule.forFeature([Authority, AuthorityGroup]), DbModule],
  controllers: [AuthorityController],
  providers: [AuthorityService, AuthorityScheduler],
})
export class AuthorityModule {}
