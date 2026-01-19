import { SwaggerModule } from '@nestjs/swagger';
import { Injectable, INestApplication } from '@nestjs/common';

import { BuilderStrategy } from '../strategies';

@Injectable()
export class SwaggerService {
  /**
   * Create the Swagger OpenAPI documentation to be served at /api
   * @param app The NestJS application
   * @param mapFn A callback to map api paths, useful for microservices
   */
  setup(app: INestApplication, mapFn?: (path: string) => string): void {
    const strategy = new BuilderStrategy();
    const document = SwaggerModule.createDocument(app, strategy.build());

    if (typeof mapFn === 'function') {
      document.paths = this.#mapPaths(document.paths, mapFn);
    }

    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        tagsSorter: 'alpha',
        operationsSorter: 'alpha',
        persistAuthorization: true,
      },
    });
  }

  /**
   * Map the paths of the Swagger document
   * @param paths The paths object
   * @param fn The callback to map the paths
   */
  #mapPaths(paths: Record<string, any>, fn: (path: string) => string): Record<string, any> {
    for (const [key, path] of Object.entries(paths)) {
      const externalPath = fn(key);
      if (externalPath === key) {
        continue;
      }

      path['localPath'] = key;
      path['externalPath'] = externalPath;
      paths[externalPath] = path;

      delete paths[key];
    }

    return paths;
  }
}
