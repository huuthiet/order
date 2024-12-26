import { Module } from '@nestjs/common';
import { BranchRevenueController } from './branch-revenue.controller';
import { BranchRevenueService } from './branch-revenue.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Branch } from 'src/branch/branch.entity';
import { BranchRevenue } from './branch-revenue.entity';
import { BranchRevenueScheduler } from './branch-revenue.scheduler';
import { BranchRevenueProfile } from './branch-revenue.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([Branch, BranchRevenue])],
  controllers: [BranchRevenueController],
  providers: [
    BranchRevenueService,
    BranchRevenueScheduler,
    BranchRevenueProfile,
  ],
})
export class BranchRevenueModule {}
