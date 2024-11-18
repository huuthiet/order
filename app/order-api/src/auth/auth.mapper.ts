import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';

import {
  AuthProfileResponseDto,
  RegisterAuthRequestDto,
  RegisterAuthResponseDto,
} from './auth.dto';
import { User } from 'src/user/user.entity';

@Injectable()
export class AuthProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, RegisterAuthRequestDto, User);
      createMap(mapper, User, RegisterAuthResponseDto);
      createMap(mapper, User, AuthProfileResponseDto);
    };
  }
}
