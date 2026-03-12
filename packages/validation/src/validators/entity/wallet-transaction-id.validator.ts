import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { WalletTransactionEntity } from '@crm/database';

@Injectable()
@ValidatorConstraint({ name: 'walletTransactionId', async: true })
export class WalletTransactionIdValidator implements ValidatorConstraintInterface, PipeTransform {
  constructor(
    @InjectRepository(WalletTransactionEntity)
    private readonly repo: Repository<WalletTransactionEntity>,
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
      throw new BadRequestException('walletTransactionId must be a valid uuid');
    }

    const entity = await this.repo.findOne({ where: { id: value } });
    if (!entity) {
      throw new BadRequestException(`walletTransactionId must reference an existing entity, ${value} provided.`);
    }

    return true;
  }
}
