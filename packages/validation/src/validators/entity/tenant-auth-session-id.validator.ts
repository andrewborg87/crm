import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { TenantAuthSessionEntity } from '@crm/database';

@Injectable()
@ValidatorConstraint({ name: 'tenantAuthSessionId', async: true })
export class TenantAuthSessionIdValidator implements ValidatorConstraintInterface, PipeTransform {
  constructor(
    @InjectRepository(TenantAuthSessionEntity)
    private readonly repo: Repository<TenantAuthSessionEntity>,
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
      throw new BadRequestException('tenantAuthSessionId must be a valid uuid');
    }

    const entity = await this.repo.findOne({ where: { id: value } });
    if (!entity) {
      throw new BadRequestException(`tenantAuthSessionId must reference an existing entity, ${value} provided.`);
    }

    return true;
  }
}
