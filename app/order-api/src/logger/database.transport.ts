import { DataSource } from 'typeorm';
import * as Transport from 'winston-transport';
import { Logger } from './logger.entity';
import { random } from 'lodash';

export class DatabaseTransport extends Transport {
  private dataSource: DataSource;

  constructor(dataSource: DataSource, opts?: Transport.TransportStreamOptions) {
    super(opts);
    this.dataSource = dataSource;
  }

  async log(info: any, next: () => void) {
    setImmediate(() => this.emit('logged', info));
    try {
      const loggerRepository = this.dataSource.getRepository(Logger);
      const logger = {
        level: info.level,
        message: info.message,
        context: info.context || null,
        pid: process.pid,
        timestamp: info.timestamp,
      } as Logger;
      loggerRepository.create(logger);
      await loggerRepository.save(logger);
    } catch (error) {
      console.error('Error saving log to database:', error);
    }

    next();
  }
}
