import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { BillingInfoEntity } from '@crm/database';

@Injectable()
@ValidatorConstraint({ name: 'billingInfoId', async: true })
export class BillingInfoIdValidator implements ValidatorConstraintInterface, PipeTransform {
  constructor(
    @InjectRepository(BillingInfoEntity)
    private readonly repo: Repository<BillingInfoEntity>,
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
      throw new BadRequestException('billingInfoId must be a valid uuid');
    }

    const entity = await this.repo.findOne({ where: { id: value } });
    if (!entity) {
      throw new BadRequestException(`billingInfoId must reference an existing entity, ${value} provided.`);
    }

    return true;
  }
}
