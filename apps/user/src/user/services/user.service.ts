import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { paginate } from 'nestjs-typeorm-paginate';
import {
  Logger,
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { User } from '@crm/types';
import { Cryptography } from '@crm/utils';
import { PaginatedResDto } from '@crm/http';
import { Role, UserStatus, AuthProvider } from '@crm/types';
import { UserEntity, UserCompanyEntity } from '@crm/database';

import { UserMapper } from '../mappers';
import { MailService } from '../../mail/services';
import { AuthService } from '../../auth/services';
import { InvitationService } from '../modules/invitation/services';
import { NewUserDto, ListUsersDto, CreateUserDto, UpdateUserDto } from '../dto';

@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    private readonly mailService: MailService,
    private readonly userMapper: UserMapper,
    private readonly invitationService: InvitationService,
    @InjectRepository(UserEntity)
    private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(UserCompanyEntity)
    private readonly userCompanyRepo: Repository<UserCompanyEntity>,
  ) {}

  readonly #logger: Logger = new Logger(this.constructor.name);

  /**
   * Fetches a user by their ID.
   * @param userId The id of the user to fetch
   */
  async get(userId: string): Promise<User> {
    const msg = `Fetching user ${userId}`;

    // Find the user by ID
    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      this.#logger.error(`${msg} - Failed`);
      throw new NotFoundException(`Failed to find user ${userId}`);
    }

    this.#logger.log(`${msg} - Complete`);
    return this.userMapper.toUser(user);
  }

  /**
   * Lists all users
   * @param dto The list dto
   */
  async list(dto: ListUsersDto): Promise<PaginatedResDto<User>> {
    // Find the traders for the company
    const traders = await paginate(
      this.userRepo,
      { limit: dto.limit, page: dto.page },
      { order: { createdAt: dto.sortDir } },
    );

    return {
      data: traders.items.map(this.userMapper.toUser),
      page: traders.meta.currentPage,
      limit: traders.meta.itemsPerPage,
      total: traders.meta.totalItems,
    };
  }

  /**
   * Updates a user by their ID.
   * @param userId The id of the user to fetch
   * @param dto The update dto
   */
  async update(userId: string, dto: UpdateUserDto): Promise<User> {
    const msg = `Updating user ${userId}`;

    // Find the user by ID
    const result = await this.userRepo.update(userId, {
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
      ...(dto.status ? { status: dto.status } : {}),
      ...(dto.password ? { password: Cryptography.hash(dto.password) } : {}),
      ...(dto.cookiesAccepted ? { isCookiesAccepted: dto.cookiesAccepted } : {}),
      ...(dto.privacyAccepted ? { isPrivacyAccepted: dto.privacyAccepted } : {}),
      ...(dto.termsAccepted ? { isTermsAccepted: dto.termsAccepted } : {}),
    });

    if (result.affected === 0) {
      this.#logger.error(`${msg} - Failed`);
      throw new UnprocessableEntityException(`Failed to update user ${userId}`);
    }

    this.#logger.log(`${msg} - Complete`);
    return this.get(userId);
  }

  /**
   * Creates a new user in the system.
   * @param dto The login dto
   */
  async create(dto: CreateUserDto): Promise<NewUserDto> {
    const msg = `Attempting to create user ${dto.email}`;

    // Create the new user
    const user = await this.userRepo.save({
      email: dto.email,
      password: Cryptography.hash(dto.password),
      firstName: dto.firstName,
      lastName: dto.lastName,
      role: Role.USER,
      status: UserStatus.ACTIVE,
      provider: AuthProvider.EMAIL,
    });

    if (!user) {
      this.#logger.error(`${msg} - Failed`);
      throw new InternalServerErrorException('Failed to create user');
    }

    // Accept invitation if token provided
    if (dto.invitationToken) {
      try {
        await this.invitationService.accept(dto.invitationToken);
      } catch {}
    }

    try {
      // Generate a confirmation token and send the email
      const token = await this.authService.generateEmailConfirmationToken(user.id);
      await this.mailService.sendConfirmEmail(user.email, token.token);

      this.#logger.log(`${msg} - Complete`);
      return { user: this.userMapper.toUser(user), tokens: { confirmEmail: token } };
    } catch (err) {
      await this.delete(user.id);
      this.#logger.error(`${msg} - Failed to send confirmation email`, err);
      throw new InternalServerErrorException('Failed to send confirmation email');
    }
  }

  /**
   * Deletes a user by their ID.
   * @param userId The id of the user to delete
   */
  async delete(userId: string): Promise<void> {
    const msg = `Deleting user ${userId}`;

    // Find the user by ID
    const result = await this.userRepo.delete({ id: userId });
    if (result.affected === 0) {
      this.#logger.error(`${msg} - Failed`);
      throw new UnprocessableEntityException(`Failed to delete user ${userId}`);
    }

    this.#logger.log(`${msg} - Complete`);
  }

  /**
   * Assigns a user to a company.
   * @param userId The id of the user
   * @param companyId The id of the company
   */
  async assignCompany(userId: string, companyId: string): Promise<boolean> {
    const msg = `Assigning user ${userId} to company ${companyId}`;

    // Check for existing assignment
    const num = await this.userCompanyRepo.count({ where: { userId, companyId } });
    if (num > 0) {
      this.#logger.log(`${msg} - Complete`);
      return true;
    }

    try {
      // Create the assignment
      await this.userCompanyRepo.save({ userId, companyId });
      this.#logger.log(`${msg} - Complete`);
      return true;
    } catch (err) {
      this.#logger.error(`${msg} - Failed`, err);
      return false;
    }
  }

  /**
   * Assigns a user to a company.
   * @param userId The id of the user
   * @param companyId The id of the company
   */
  async removeCompany(userId: string, companyId: string): Promise<boolean> {
    const msg = `Remove user ${userId} to company ${companyId}`;

    // Check for existing assignment
    const num = await this.userCompanyRepo.count({ where: { userId, companyId } });
    if (num === 0) {
      this.#logger.log(`${msg} - Complete`);
      return true;
    }

    // Ensure not removing the last user from the company
    const numUsers = await this.userCompanyRepo.count({ where: { companyId } });
    if (numUsers === 1) {
      this.#logger.log(`${msg} - Failed - Cannot remove last user from company`);
      throw new UnprocessableEntityException('Cannot remove last user from company');
    }

    const result = await this.userCompanyRepo.delete({ userId, companyId });
    return result?.affected ? result?.affected > 0 : false;
  }
}
