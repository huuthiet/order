import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { GetLoggerRequestDto, LoggerResponseDto } from './logger.dto';

@Controller('logger')
@ApiBearerAuth()
@ApiTags('Logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  @Public()
  @ApiQuery({ name: 'level', required: false, type: String })
  async getAllLogs(
    @Query(new ValidationPipe({ transform: true }))
    query: GetLoggerRequestDto,
  ): Promise<LoggerResponseDto[]> {
    return this.loggerService.getAllLogs(query);
  }
}
