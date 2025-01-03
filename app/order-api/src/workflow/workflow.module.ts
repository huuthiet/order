import { Module } from "@nestjs/common";
import { Workflow } from "./workflow.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { WorkflowController } from "./workflow.controller";
import { WorkflowService } from "./workflow.service";
import { WorkflowProfile } from './workflow.mapper';
import { Branch } from "src/branch/branch.entity";
import { Tracking } from "src/tracking/tracking.entity";
import { TrackingOrderItem } from "src/tracking-order-item/tracking-order-item.entity";
import { OrderItem } from "src/order-item/order-item.entity";
import { Order } from "src/order/order.entity";
import { TrackingScheduler } from "src/tracking/tracking.scheduler";
import { RobotConnectorClient } from "src/robot-connector/robot-connector.client";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([
    Workflow, 
    Branch,
    Tracking, 
    TrackingOrderItem,
    OrderItem,
    Order
  ])],
  controllers: [WorkflowController],
  providers: [
    WorkflowService, 
    WorkflowProfile, 
    TrackingScheduler,
    RobotConnectorClient,
  ],
})
export class WorkflowModule {}