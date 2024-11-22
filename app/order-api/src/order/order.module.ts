import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './order.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderItem } from 'src/order-item/order-item.entity';
import { OrderProfile } from './order.mapper';
import { Table } from 'src/table/table.entity';
import { Branch } from 'src/branch/branch.entity';
import { User } from 'src/user/user.entity';
import { Variant } from 'src/variant/variant.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    Order, 
    Table,
    Branch, 
    User,
    Variant
  ])],
  controllers: [OrderController],
  providers: [
    OrderService,
    OrderProfile
  ],
  exports: [OrderService]
})
export class OrderModule {}
