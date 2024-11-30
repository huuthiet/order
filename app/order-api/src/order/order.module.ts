import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderProfile } from './order.mapper';
import { Table } from 'src/table/table.entity';
import { Branch } from 'src/branch/branch.entity';
import { User } from 'src/user/user.entity';
import { Variant } from 'src/variant/variant.entity';
import { RobotConnectorModule } from 'src/robot-connector/robot-connector.module';
import { Tracking } from 'src/tracking/tracking.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order, Table, Branch, User, Variant, Tracking]),
    RobotConnectorModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderProfile],
  exports: [OrderService],
})
export class OrderModule {}
