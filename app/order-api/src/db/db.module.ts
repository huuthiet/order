import { Module } from '@nestjs/common';
import { DbService } from './db.service';
import { DbController } from './db.controller';
import { GoogleDriveService } from './google-drive.service';
import { DbScheduler } from './db.scheduler';
import { ConfigModule, ConfigService } from '@nestjs/config';
import databaseConfig from 'src/config/database.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransactionManagerService } from './transaction-manager.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [databaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return configService.get('database');
      },
    }),
  ],
  controllers: [DbController],
  providers: [
    DbService,
    GoogleDriveService,
    DbScheduler,
    TransactionManagerService,
  ],
  exports: [TransactionManagerService],
})
export class DbModule {}
