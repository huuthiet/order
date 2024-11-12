import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class BaseResponseDto {
  @AutoMap()
  createdAt: string;

  @AutoMap()
  updatedAt: string;

  @AutoMap()
  @ApiProperty()
  slug: string;
}
