import { Module } from '@nestjs/common';
import { RevenueService } from './revenue.service';
import { RevenueController } from './revenue.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Revenue } from './revenue.entity';
import { RevenueProfile } from './revenue.mapper';
import { RevenueScheduler } from './revenue.scheduler';
import { Branch } from 'src/branch/branch.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Revenue, Branch])],
  controllers: [RevenueController],
  providers: [RevenueService, RevenueProfile, RevenueScheduler],
})
export class RevenueModule {}
