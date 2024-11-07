import { DocumentBuilder } from '@nestjs/swagger';

export default () => {
  return new DocumentBuilder()
    .setTitle('Order API')
    .setDescription('The Order API description')
    .setVersion('1.0')
    .build();
};
