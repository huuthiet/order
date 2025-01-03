import { createLogger, format, transports } from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston';
import { DatabaseTransport } from 'src/logger/database.transport';
import { DataSource } from 'typeorm';
import { OpenTelemetryTransportV3 } from '@opentelemetry/winston-transport';

export const createWinstonLogger = (dataSource: DataSource) => {
  return createLogger({
    format: format.combine(format.timestamp(), format.json()),
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike(),
        ),
      }),
      new DatabaseTransport(dataSource),
      new OpenTelemetryTransportV3(),
    ],
  });
};
