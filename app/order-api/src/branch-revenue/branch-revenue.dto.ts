import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BaseResponseDto } from 'src/app/base.dto';

export class BranchRevenueQueryResponseDto {
  @AutoMap()
  branchId: string;

  @AutoMap()
  date: Date;

  @AutoMap()
  totalAmount: string;

  @AutoMap()
  totalOrder: string;
}

export class GetBranchRevenueQueryDto {
  @AutoMap()
  @ApiProperty({ required: false, example: '2024-12-26' })
  @Type(() => Date)
  startDate: Date;

  @AutoMap()
  @ApiProperty({ required: false, example: '2024-12-27' })
  @Type(() => Date)
  endDate: Date;
}

export class BranchRevenueResponseDto extends BaseResponseDto {
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
