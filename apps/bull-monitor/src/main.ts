import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { useContainer } from 'class-validator';
import { Logger, ValidationPipe } from '@nestjs/common';

import { HttpExceptionFilter } from '@crm/http';
import { EcsLogger, RestLogInterceptor } from '@crm/logger';
import { SwaggerModule, SwaggerService } from '@crm/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Set the app module as the service container (required for class-validator)
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Get configuration service
  const config = app.get(ConfigService);

  // Set logger
  const isDev = 'development' === config.get('NODE_ENV');
  app.useLogger(isDev ? ['debug'] : new EcsLogger());

  // Set global prefix for all routes
  app.setGlobalPrefix('admin', { exclude: ['api/alive', 'api/alive/ping'] });

  // Register global pipes
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Register global interceptors
  app.useGlobalInterceptors(new RestLogInterceptor());

  // Register global filters
  app.useGlobalFilters(new HttpExceptionFilter());

  // Starts listening for shutdown hooks
  app.enableShutdownHooks();

  // Prepare the Swagger Docs
  app.select(SwaggerModule).get(SwaggerService).setup(app);

  // Start the application
  await app.listen(3000);
  Logger.log(`Bull Monitor listening on: http://localhost:3002/admin/ui`);
}

bootstrap().then().catch(console.error);
