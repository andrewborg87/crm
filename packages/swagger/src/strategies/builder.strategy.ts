import { OpenAPIObject, DocumentBuilder } from '@nestjs/swagger';

import { BuildStrategy } from './build-strategy.interface';

export class BuilderStrategy implements BuildStrategy {
  build(): Omit<OpenAPIObject, 'paths'> {
    const title = (process.env.APP_NAME ?? '').replace(/_/g, ' ');

    return new DocumentBuilder()
      .setTitle(`${title}`)
      .setDescription('OpenAPI Documentation')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        in: 'header',
        name: 'Bearer',
        description: 'JWT Token',
      })
      .build();
  }
}
