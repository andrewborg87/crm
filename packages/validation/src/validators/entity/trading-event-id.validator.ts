import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { TradingEventEntity } from '@crm/database';

@Injectable()
@ValidatorConstraint({ name: 'tradingEventId', async: true })
export class TradingEventIdValidator implements ValidatorConstraintInterface, PipeTransform {
  constructor(
    @InjectRepository(TradingEventEntity)
    private readonly repo: Repository<TradingEventEntity>,
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
      throw new BadRequestException('tradingEventId must be a valid uuid');
    }

    const entity = await this.repo.findOne({ where: { id: value } });
    if (!entity) {
      throw new BadRequestException(`tradingEventId must reference an existing entity, ${value} provided.`);
    }

    return true;
  }
}
