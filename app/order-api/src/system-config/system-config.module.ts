import { Global, Module } from '@nestjs/common';
import { SystemConfigService } from './system-config.service';
import { SystemConfigController } from './system-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SystemConfig } from './system-config.entity';
import { SystemConfigProfile } from './system-config.mapper';

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([SystemConfig])],
  controllers: [SystemConfigController],
  providers: [SystemConfigService, SystemConfigProfile],
  exports: [SystemConfigService],
})
export class SystemConfigModule {}
