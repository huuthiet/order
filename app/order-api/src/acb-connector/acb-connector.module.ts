import { Module } from '@nestjs/common';
import { ACBConnectorClient } from './acb-connector.client';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { ACBConnectorController } from './acb-connector.controller';
import { ACBConnectorService } from './acb-connector.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ACBConnectorConfig } from './acb-connector.entity';
import { ACBConnectorProfile } from './acb-connector.mapper';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule,
    TypeOrmModule.forFeature([ACBConnectorConfig]),
  ],
  providers: [ACBConnectorClient, ACBConnectorService, ACBConnectorProfile],
  exports: [ACBConnectorClient],
  controllers: [ACBConnectorController],
})
export class ACBConnectorModule {}
