import { Module } from '@nestjs/common';
import { BranchController } from './branch.controller';
import { BranchService } from './branch.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from './branch.entity';
import { BranchProfile } from './branch.mapper';
import { BranchScheduler } from './branch.scheduler';

@Module({
  imports: [TypeOrmModule.forFeature([Branch])],
  controllers: [BranchController],
  providers: [BranchService, BranchProfile, BranchScheduler],
})
export class BranchModule {}
