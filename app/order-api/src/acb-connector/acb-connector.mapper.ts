import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import {
  ACBConnectorConfigResponseDto,
  CreateACBConnectorConfigRequestDto,
} from './acb-connector.dto';
import { ACBConnectorConfig } from './acb-connector.entity';

@Injectable()
export class ACBConnectorProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, CreateACBConnectorConfigRequestDto, ACBConnectorConfig);
      createMap(mapper, ACBConnectorConfig, ACBConnectorConfigResponseDto);
    };
  }
}
