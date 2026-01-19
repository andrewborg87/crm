import { OpenAPIObject } from '@nestjs/swagger';

export interface BuildStrategy {
  build(): Omit<OpenAPIObject, 'paths'> | Promise<Omit<OpenAPIObject, 'paths'>>;
}
