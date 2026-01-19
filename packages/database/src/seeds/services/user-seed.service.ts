import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Logger, Injectable } from '@nestjs/common';

import { Cryptography } from '@crm/utils';

import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class UserSeedService {
  constructor(@InjectRepository(UserEntity) private userRepo: Repository<UserEntity>) {}

  readonly #logger = new Logger(this.constructor.name);

  async run() {
    this.#logger.log('Starting users seed');

    const user = new UserEntity();
    const superUser = new UserEntity();

    try {
      const count = await this.userRepo.count({ where: { email: 'user@example.com' } });
      if (count === 0) {
        user.firstName = 'John';
        user.lastName = 'Doe';
        user.email = 'user@example.com';
        user.password = Cryptography.hash('P@ssword123');
        await this.userRepo.save(user);
      }

      const countSuper = await this.userRepo.count({ where: { email: 'user@example.com' } });
      if (countSuper === 0) {
        superUser.firstName = 'John';
        superUser.lastName = 'Doe (super)';
        superUser.email = 'super_user@example.com';
        superUser.password = Cryptography.hash('P@ssword123');
        await this.userRepo.save(superUser);
      }

      if (!user.firstName && !superUser.firstName) {
        this.#logger.log('Users already seeded, skipping');
      }
    } catch (err) {
      this.#logger.error(`Error seeding users`, err);
      throw err;
    }
  }
}
