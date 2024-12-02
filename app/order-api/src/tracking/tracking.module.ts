import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tracking } from './tracking.entity';
import { TrackingOrderItem } from 'src/tracking-order-item/tracking-order-item.entity';
import { OrderItem } from 'src/order-item/order-item.entity';
import { TrackingController } from './tracking.controller';
import { TrackingService } from './tracking.service';
import { Order } from 'src/order/order.entity';
import { TrackingProfile } from './tracking.mapper';
import { Table } from 'src/table/table.entity';
import { RobotConnectorModule } from 'src/robot-connector/robot-connector.module';
import { Workflow } from 'src/workflow/workflow.entity';
import { TrackingScheduler } from './tracking.scheduler';

@Module({
  imports: [
    TypeOrmModule.forFeature([
    Tracking, 
    TrackingOrderItem, 
    OrderItem,
    Order,
    Table,
    Workflow
    ]),
    RobotConnectorModule
  ],
  controllers: [TrackingController],
  providers: [TrackingService, TrackingProfile, TrackingScheduler],
})
export class TrackingModule {}
