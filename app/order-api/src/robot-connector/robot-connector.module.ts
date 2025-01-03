import { Module } from '@nestjs/common';
import { CallRobotController } from './robot-connector.controller';
import { RobotConnectorService } from './robot-connector.service';
import { HttpModule } from '@nestjs/axios';
import { RobotConnectorClient } from './robot-connector.client';
import { ConfigModule } from '@nestjs/config';
import { Tracking } from 'src/tracking/tracking.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrackingScheduler } from 'src/tracking/tracking.scheduler';
import { TrackingOrderItem } from 'src/tracking-order-item/tracking-order-item.entity';
import { OrderItem } from 'src/order-item/order-item.entity';
import { Order } from 'src/order/order.entity';

@Module({
  imports: [
    ConfigModule.forRoot(), 
    HttpModule,
    TypeOrmModule.forFeature([
      Tracking, 
    ])
  ],
  controllers: [CallRobotController],
  providers: [
    RobotConnectorService,
    RobotConnectorClient,
  ],
  exports: [RobotConnectorClient, RobotConnectorService],
})
export class RobotConnectorModule {}
