import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateBranchDto {
  @AutoMap()
  @ApiProperty({ description: 'The day of menu', example: '' })
  @IsNotEmpty()
  name: string;

  @AutoMap()
  @ApiProperty({ description: 'The name of catalog', example: '' })
  @IsNotEmpty()
  address: string;
}

export class BranchResponseDto {
  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  address: string;
}