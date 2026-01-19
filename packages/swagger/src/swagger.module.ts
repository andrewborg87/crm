import { Module } from '@nestjs/common';

import { SwaggerService } from './services/swagger.service';

@Module({
  providers: [SwaggerService],
})
export class SwaggerModule {}
