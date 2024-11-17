import { Controller, Get } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from 'src/auth/public.decorator';
import { LoggerResponseDto } from './logger.dto';

@Controller('logger')
@ApiBearerAuth()
@ApiTags('Logger')
export class LoggerController {
  constructor(private readonly loggerService: LoggerService) {}

  @Get()
  @Public()
  async getAllLogs(): Promise<LoggerResponseDto[]> {
    return this.loggerService.getAllLogs();
  }
}
