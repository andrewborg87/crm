import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { UserDetailEntity } from '@crm/database';

@Injectable()
@ValidatorConstraint({ name: 'userDetailId', async: true })
export class UserDetailIdValidator implements ValidatorConstraintInterface, PipeTransform {
  constructor(
    @InjectRepository(UserDetailEntity)
    private readonly repo: Repository<UserDetailEntity>,
  ) {}

  async validate(value: string): Promise<boolean> {
    return this.#exec(value);
  }

  async transform(value: string): Promise<string> {
    await this.#exec(value);
    return value;
  }

  async #exec(value: string): Promise<boolean> {
    if (!isUUID(value)) {
      throw new BadRequestException('userDetailId must be a valid uuid');
    }

    const entity = await this.repo.findOne({ where: { id: value } });
    if (!entity) {
      throw new BadRequestException(`userDetailId must reference an existing entity, ${value} provided.`);
    }

    return true;
  }
}
