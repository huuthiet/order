import { AutoMap } from '@automapper/classes';
import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateSystemConfigDto {
  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  key: string;

  @AutoMap()
  @ApiProperty()
  @IsNotEmpty()
  value: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  description?: string;
}

export class UpdateSystemConfigDto extends CreateSystemConfigDto {}

export class DeleteSystemConfigDto {
  @AutoMap()
  @ApiProperty()
  @IsOptional()
  key: string;

  @AutoMap()
  @ApiProperty()
  @IsOptional()
  slug: string;
}

export class GetSystemConfigQueryDto {
  @AutoMap()
  @ApiProperty({ required: false })
  @IsOptional()
  key?: string;

  @AutoMap()
  @ApiProperty({ required: false })
  @IsOptional()
  slug?: string;
}

export class SystemConfigResponseDto {
  @AutoMap()
  @ApiProperty()
  key: string;

  @AutoMap()
  @ApiProperty()
  value: string;

  @AutoMap()
  @ApiProperty()
  description?: string;
}
