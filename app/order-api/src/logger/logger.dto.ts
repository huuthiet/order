import { AutoMap } from '@automapper/classes';
import { BaseResponseDto } from 'src/app/base.dto';

export class LoggerResponseDto extends BaseResponseDto {
  @AutoMap()
  level: string;

  @AutoMap()
  message: string;

  @AutoMap()
  context: string;

  @AutoMap()
  timestamp: string;

  @AutoMap()
  pid: number;
}
