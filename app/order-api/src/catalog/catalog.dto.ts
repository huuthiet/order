import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseResponseDto } from 'src/app/base.dto';
import { INVALID_CATALOG_NAME } from './catalog.validation';

export class CreateCatalogRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The name of catalog', example: 'Đồ ăn' })
  @IsNotEmpty({ message: INVALID_CATALOG_NAME })
  name: string;

  @AutoMap()
  @ApiProperty({
    description: 'The description of catalog',
    example: 'Các loại đồ ăn',
  })
  @IsOptional()
  description?: string;
}

export class CatalogResponseDto extends BaseResponseDto {
  @ApiProperty()
  @AutoMap()
  name: string;

  @ApiProperty()
  @AutoMap()
  description?: string;
}
