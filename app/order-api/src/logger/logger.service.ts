import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger } from './logger.entity';
import { Repository } from 'typeorm';
import { InjectMapper } from '@automapper/nestjs';
import { Mapper } from '@automapper/core';
import { LoggerResponseDto } from './logger.dto';

@Injectable()
export class LoggerService {
  constructor(
    @InjectRepository(Logger)
    private readonly loggerRepository: Repository<Logger>,
    @InjectMapper()
    private readonly mapper: Mapper,
  ) {}

  async getAllLogs() {
    const logs = await this.loggerRepository.find();
    return this.mapper.mapArray(logs, Logger, LoggerResponseDto);
  }
}
