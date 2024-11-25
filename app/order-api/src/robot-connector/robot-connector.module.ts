import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Tracking } from "src/tracking/tracking.entity";
import { CallRobotController } from "./robot-connector.controller";
import { RobotConnectorService } from "./robot-connector.service";
import { HttpModule } from "@nestjs/axios";
import { RobotConnectorClient } from "./robot-connector.client";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    // TypeOrmModule.forFeature([])
  ],
  controllers: [CallRobotController],
  providers: [RobotConnectorService, RobotConnectorClient],
  exports: [RobotConnectorClient]
})
export class RobotConnectorModule {}