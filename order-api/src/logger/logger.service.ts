import { Injectable, Logger } from '@nestjs/common';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

@Injectable()
export class LoggerService extends Logger {
  private readonly logger: winston.Logger;

  constructor(context: string) {
    super(context);
    this.logger = winston.createLogger({
      levels: winston.config.syslog.levels,
      format: winston.format.combine(
        winston.format((info) => {
          return {
            ...info,
            context,
          };
        })(),
        winston.format.timestamp({ format: 'MM/DD/YYYY, h:mm:ss A' }),
        winston.format.printf(({ timestamp, level, message, context }) => {
          const pid = process.pid;
          return `[Nest] ${pid}  - ${timestamp}     ${level.toUpperCase()} [${context || 'Application'}] ${message}`;
        }),
      ),
      transports: [new winston.transports.Console()],
    });
  }
}
