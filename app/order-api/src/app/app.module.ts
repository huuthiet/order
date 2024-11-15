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

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
      validate: validate,
    }),
    DatabaseModule,
    AuthModule,
    FileModule,
    HealthModule,
    SizeModule,
    CatalogModule,
    ProductModule,
    VariantModule,
    MenuModule,
    BranchModule,
    AutomapperModule.forRoot({
      strategyInitializer: classes(),
    }),
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
  ],
})
export class AppModule {}
