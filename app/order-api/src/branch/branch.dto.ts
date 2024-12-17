import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { BaseResponseDto } from 'src/app/base.dto';

export class CreateBranchDto {
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  address: string;
}

export class UpdateBranchDto {
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  address: string;
}

export class BranchResponseDto extends BaseResponseDto {
  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  address: string;
}
