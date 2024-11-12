import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

export const config = new DocumentBuilder()
  .setTitle('Order API')
  .setDescription('API documentation')
  .setVersion('1.0')
  .setBasePath('api/v1')
  .build();

export const documentOptions: SwaggerDocumentOptions = {
  ignoreGlobalPrefix: true,
};
