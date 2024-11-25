import { AutoMap } from '@automapper/classes';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, Min } from 'class-validator';
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

export class GetLoggerRequestDto {
  @AutoMap()
  @ApiProperty({
    example: 'info',
    description: 'Log level',
    enum: ['info', 'warn', 'error', 'debug'],
  })
  @IsOptional()
  level: string;

  @AutoMap()
  @ApiProperty({
    example: 1,
    description: 'Page number',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page: number;

  @AutoMap()
  @ApiProperty({
    example: 10,
    description: 'Number of items per page',
  })
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  size: number;
}
