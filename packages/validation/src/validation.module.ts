import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserEntity } from '@crm/database';

import * as Validators from './validators';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  providers: [Validators.BooleanValidator, Validators.PasswordValidator, Validators.UserIdValidator],
})
export class ValidationModule {}
