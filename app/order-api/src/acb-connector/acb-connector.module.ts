import { Module } from '@nestjs/common';
import { ACBConnectorClient } from './acb-connector.client';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), HttpModule],
  providers: [ACBConnectorClient],
  exports: [ACBConnectorClient],
})
export class AcbConnectorModule {}
