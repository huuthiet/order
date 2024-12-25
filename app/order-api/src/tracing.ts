import { SimpleSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { ATTR_SERVICE_NAME } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { OTLPExporterNodeConfigBase } from '@opentelemetry/otlp-exporter-base';
import * as dotenv from 'dotenv';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';

dotenv.config();

const otlPExporterNodeConfigBase: OTLPExporterNodeConfigBase = {
  url: `${process.env.TRACING_URL}/v1/traces`,
  headers: {},
};

const oltpExporter = new OTLPTraceExporter(otlPExporterNodeConfigBase);

const traceExporter = oltpExporter;

export const otelSDK = new NodeSDK({
  resource: new Resource({
    [ATTR_SERVICE_NAME]: `order-api`, // update this to a more relevant name for you!
  }),
  spanProcessor: new SimpleSpanProcessor(traceExporter),
  instrumentations: [
    new HttpInstrumentation(),
    new ExpressInstrumentation(),
    new NestInstrumentation(),
  ],
});

// gracefully shut down the SDK on process exit
process.on('SIGTERM', () => {
  otelSDK
    .shutdown()
    .then(
      () => console.log('SDK shut down successfully'),
      (err) => console.log('Error shutting down SDK', err),
    )
    .finally(() => process.exit(0));
});
