import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';

import { UserEntity, CompanyEntity } from '@crm/database';

import { UserMapper } from './mappers';
import { UserService } from './services';
import { AuthModule } from '../auth/auth.module';
import { UserController } from './user.controller';

@Module({
  imports: [forwardRef(() => AuthModule), TypeOrmModule.forFeature([CompanyEntity, UserEntity])],
  providers: [UserMapper, UserService],
  controllers: [UserController],
  exports: [UserMapper, UserService],
})
export class UserModule {}
