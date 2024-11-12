import { AutoMap } from "@automapper/classes";
import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsOptional } from "class-validator";
import { BaseResponseDto } from "src/app/base.dto";

export class CreateCatalogRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The name of catalog', example: 'đồ ăn'})
  @IsNotEmpty({ message: 'Catalog name is required' })
  name: string;

  @AutoMap()
  @ApiProperty({ description: 'The description of catalog', example: 'Các loại đồ ăn'})
  @IsOptional()
  description?: string;
}

export class UpdateCatalogRequestDto {
  @AutoMap()
  @ApiProperty({ description: 'The name of catalog', example: 'đồ ăn'})
  @IsNotEmpty({ message: 'Catalog name is required' })
  name: string;

  @AutoMap()
  @ApiProperty({ description: 'The description of catalog', example: 'Các loại đồ ăn'})
  @IsOptional()
  description?: string;
}

export class CatalogResponseDto extends BaseResponseDto {
  @AutoMap()
  name: string;

  @AutoMap()
  description?: string;
}