import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import * as dotenv from 'dotenv';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPLogExporter } from '@opentelemetry/exporter-logs-otlp-http';
import {
  BatchLogRecordProcessor,
  LoggerProvider,
} from '@opentelemetry/sdk-logs';
import * as api from '@opentelemetry/api-logs';

dotenv.config();

const resource = new Resource({
  [ATTR_SERVICE_NAME]: 'nestjs-order-api',
  [ATTR_SERVICE_VERSION]: 'v1.0.0',
});

// Configure Trace Exporter
const traceExporter = new OTLPTraceExporter({
  url: `${process.env.OTEL_LGTM_URL}/v1/traces`,
  headers: {},
});

// Configure Log Exporter
const logExporter = new OTLPLogExporter({
  url: `${process.env.OTEL_LGTM_URL}/v1/logs`,
  headers: {},
});

export const loggerProvider = new LoggerProvider({
  resource,
});
loggerProvider.addLogRecordProcessor(new BatchLogRecordProcessor(logExporter));
api.logs.setGlobalLoggerProvider(loggerProvider);

export const otelSDK = new NodeSDK({
  resource: resource,
  spanProcessors: [new SimpleSpanProcessor(traceExporter)],
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
  ],
});

// gracefully shut down the SDK on process exit
// process.on('SIGTERM', () => {
//   otelSDK
//     .shutdown()
//     .then(
//       () => console.log('SDK shut down successfully'),
//       (err) => console.log('Error shutting down SDK', err),
//     )
//     .finally(() => process.exit(0));
// });
