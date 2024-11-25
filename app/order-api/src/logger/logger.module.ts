import { Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { WinstonModule } from 'nest-winston';
import { DataSource } from 'typeorm';
import { createWinstonLogger } from 'src/config/logger.config';
import { LoggerController } from './logger.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './logger.entity';
import { LoggerProfile } from './logger.mapper';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    WinstonModule.forRootAsync({
      useFactory: (dataSource: DataSource) => {
        return createWinstonLogger(dataSource);
      },
      inject: [DataSource],
    }),
    TypeOrmModule.forFeature([Logger]),
    ScheduleModule.forRoot(),
  ],
  providers: [LoggerService, LoggerProfile],
  controllers: [LoggerController],
})
export class LoggerModule {}
