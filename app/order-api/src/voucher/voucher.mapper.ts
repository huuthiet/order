import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper } from '@automapper/core';
import { Injectable } from '@nestjs/common';
import { Voucher } from './voucher.entity';
import { CreateVoucherDto, VoucherResponseDto } from './voucher.dto';

@Injectable()
export class VoucherProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  override get profile() {
    return (mapper: Mapper) => {
      createMap(mapper, Voucher, VoucherResponseDto);
      createMap(mapper, CreateVoucherDto, Voucher);
    };
  }
}
