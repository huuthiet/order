import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { BaseResponseDto } from 'src/app/base.dto';

export class CreateCatalogRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The name of catalog', example: 'Đồ ăn' })
  @IsNotEmpty({ message: 'Catalog name is required' })
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
