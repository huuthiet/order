import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { DataSource } from 'typeorm';
import { createWinstonLogger } from 'src/config/logger.config';
import { LoggerController } from './logger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './logger.entity';
import { LoggerProfile } from './logger.mapper';
import { LoggerScheduler } from './logger.scheduler';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (dataSource: DataSource) => {
        return createWinstonLogger(dataSource);
      },
      inject: [DataSource],
    }),
    TypeOrmModule.forFeature([Logger]),
  ],
  providers: [LoggerService, LoggerProfile, LoggerScheduler],
  controllers: [LoggerController],
})
export class LoggerModule {}
