import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { UserSettingEntity } from '@crm/database';

@Injectable()
@ValidatorConstraint({ name: 'userSettingId', async: true })
export class UserSettingIdValidator implements ValidatorConstraintInterface, PipeTransform {
  constructor(
    @InjectRepository(UserSettingEntity)
    private readonly repo: Repository<UserSettingEntity>,
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
      throw new BadRequestException('userSettingId must be a valid uuid');
    }

    const entity = await this.repo.findOne({ where: { id: value } });
    if (!entity) {
      throw new BadRequestException(`userSettingId must reference an existing entity, ${value} provided.`);
    }

    return true;
  }
}
