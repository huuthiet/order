import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';

export class FileResponseDto {
  @AutoMap()
  @ApiProperty()
  name: string;

  @AutoMap()
  @ApiProperty()
  extension: string;

  @AutoMap()
  @ApiProperty()
  mimetype: string;

  @AutoMap()
  @ApiProperty()
  data: Buffer;

  @AutoMap()
  @ApiProperty()
  size: number;
}
