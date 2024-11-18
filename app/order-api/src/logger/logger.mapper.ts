import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, extend, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Logger } from './logger.entity';
import { LoggerResponseDto } from './logger.dto';
import { baseMapper } from 'src/app/base.mapper';

@Injectable()
export class LoggerProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Logger, LoggerResponseDto, extend(baseMapper(mapper)));
    };
  }
}
