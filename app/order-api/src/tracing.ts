import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NodeSDK } from '@opentelemetry/sdk-node';
import * as process from 'process';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { ExpressInstrumentation } from '@opentelemetry/instrumentation-express';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { Resource } from '@opentelemetry/resources';
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';
import * as dotenv from 'dotenv';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-proto';

const jaegerExporter = new JaegerExporter({
  endpoint: 'http://localhost:14268/api/traces',
});
const oltpExporter = new OTLPTraceExporter({
  url: `https://api.honeycomb.io/v1/traces`,
  headers: {
    'x-honeycomb-team':
      process.env.HONEYCOMB_API_KEY || 'Uc7J0tRMTV3slEphJhfFfG',
  },
});

const traceExporter =
  process.env.NODE_ENV === `development` ? jaegerExporter : oltpExporter;

export const otelSDK = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: `order-api`, // update this to a more relevant name for you!
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
