import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { INVALID_BRANCH_SLUG, INVALID_DAY } from './menu.validation';

export class CreateMenuDto {
  @AutoMap()
  @ApiProperty({ description: 'The day of menu', example: '2024-12-20' })
  @IsNotEmpty({ message: INVALID_DAY })
  day: string;

  @AutoMap()
  @ApiProperty({ description: 'The name of catalog', example: '6c661e85' })
  @IsNotEmpty({ message: INVALID_BRANCH_SLUG })
  branchSlug: string;
}

export class UpdateMenuDto extends CreateMenuDto {}

export class MenuResponseDto {
  @AutoMap()
  @ApiProperty()
  day: string;
}
