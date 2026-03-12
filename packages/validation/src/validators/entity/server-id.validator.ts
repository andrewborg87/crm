import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { isUUID, ValidatorConstraint, ValidatorConstraintInterface } from 'class-validator';

import { ServerEntity } from '@crm/database';

@Injectable()
@ValidatorConstraint({ name: 'serverId', async: true })
export class ServerIdValidator implements ValidatorConstraintInterface, PipeTransform {
  constructor(
    @InjectRepository(ServerEntity)
    private readonly repo: Repository<ServerEntity>,
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
      throw new BadRequestException('serverId must be a valid uuid');
    }

    const entity = await this.repo.findOne({ where: { id: value } });
    if (!entity) {
      throw new BadRequestException(`serverId must reference an existing entity, ${value} provided.`);
    }

    return true;
  }
}
