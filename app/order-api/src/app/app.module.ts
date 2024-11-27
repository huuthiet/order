import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration from '../config/configuration';
import { validate } from './env.validation';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from 'src/auth/auth.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { APP_FILTER } from '@nestjs/core';
import { HttpExceptionFilter } from './http-exception.filter';
import { FileModule } from 'src/file/file.module';
import { HealthModule } from 'src/health/health.module';
import { SizeModule } from 'src/size/size.module';
import { AutomapperModule } from '@automapper/nestjs';
import { classes } from '@automapper/classes';
import { CatalogModule } from 'src/catalog/catalog.module';
import { ProductModule } from 'src/product/product.module';
import { VariantModule } from 'src/variant/variant.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import { MenuModule } from 'src/menu/menu.module';
import { BranchModule } from 'src/branch/branch.module';
import { AppSubscriber } from './app.subscriber';
import { TableModule } from 'src/table/table.module';
import { MenuItemModule } from 'src/menu-item/menu-item.module';
import { PaymentModule } from 'src/payment/payment.module';
import { ACBConnectorModule } from 'src/acb-connector/acb-connector.module';
import { OrderItemModule } from 'src/order-item/order-item.module';
import { OrderModule } from 'src/order/order.module';
import { TrackingModule } from 'src/tracking/tracking.module';
import { TrackingOrderItemModule } from 'src/tracking-order-item/tracking-order-item.module';
import { RobotConnectorModule } from 'src/robot-connector/robot-connector.module';
import { UserModule } from 'src/user/user.module';
import { ScheduleModule } from '@nestjs/schedule';
import { LoggerModule } from 'src/logger/logger.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { WorkflowModule } from 'src/workflow/workflow.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validate: validate,
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    DatabaseModule,
    AuthModule,
    FileModule,
    HealthModule,
    SizeModule,
    CatalogModule,
    ProductModule,
    VariantModule,
    MenuModule,
    MenuItemModule,
    BranchModule,
    TransactionModule,
    LoggerModule,
    TableModule,
    PaymentModule,
    ACBConnectorModule,
    OrderItemModule,
    OrderModule,
    TrackingModule,
    TrackingOrderItemModule,
    RobotConnectorModule,
    UserModule,
    WorkflowModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AppSubscriber,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
