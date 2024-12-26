import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { BaseResponseDto } from 'src/app/base.dto';

export class RevenueQueryResponseDto {
  @AutoMap()
  branchId: string;

  @AutoMap()
  date: Date;

  @AutoMap()
  totalAmount: string;

  @AutoMap()
  totalOrder: string;
}

export class GetRevenueQueryDto {
  @AutoMap()
  @ApiProperty({ required: false })
  branch: string;
}

export class RevenueResponseDto extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  branchId: string;

  @AutoMap()
  @ApiProperty()
  date: Date;

  @AutoMap()
  @ApiProperty()
  totalAmount: number;

  @AutoMap()
  @ApiProperty()
  totalOrder: number;
}
