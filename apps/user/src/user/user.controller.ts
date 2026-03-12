import { ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { Get, Req, Body, Post, Param, Patch, Query, Delete, Controller } from '@nestjs/common';

import { Role } from '@crm/types';
import { User } from '@crm/types';
import { OpenApi } from '@crm/swagger';
import { PaginatedResDto } from '@crm/http';
import { Auth, AuthenticatedReq } from '@crm/auth';
import { UserIdValidator, CompanyIdValidator } from '@crm/validation';

import { UserService } from './services';
import { NewUserDto, ListUsersDto, CreateUserDto, UpdateUserDto } from './dto';

@ApiTags('User')
@ApiExtraModels(NewUserDto, CreateUserDto, ListUsersDto, UpdateUserDto)
@Controller({ path: 'users', version: '1' })
export class UserController {
  constructor(private readonly service: UserService) {}

  /**
   * Get a user by id
   * @param userId The user id to fetch
   */
  @Auth()
  @OpenApi({ type: User })
  @Get(':userId')
  public async get(@Param('userId', UserIdValidator) userId: string): Promise<{ data: User }> {
    const result = await this.service.get(userId);
    return { data: result };
  }

  /**
   * Updates a user by id
   * @param userId The user id to update
   * @param dto The dto
   * @param req The authenticated request
   */
  @Auth()
  @OpenApi({ type: User })
  @Patch(':userId')
  public async update(
    @Param('userId', UserIdValidator) userId: string,
    @Body() dto: UpdateUserDto,
    @Req() req: AuthenticatedReq,
  ): Promise<{ data: User }> {
    // Only allow admins to update the status of any user
    if (Role.ADMIN !== req.user.role) {
      dto.status = undefined;
    }

    return { data: await this.service.update(userId, dto) };
  }

  /**
   * Lists all users in the system
   * @param dto The dto with options to filter the results by.
   */
  @Auth()
  @OpenApi({ type: User, isPaginated: true })
  @Get()
  public async list(@Query() dto: ListUsersDto): Promise<PaginatedResDto<User>> {
    return await this.service.list(dto);
  }

  /**
   * Create a new user
   * @param dto The dto
   */
  @OpenApi({ type: NewUserDto })
  @Post()
  public async create(@Body() dto: CreateUserDto): Promise<{ data: NewUserDto }> {
    return { data: await this.service.create(dto) };
  }

  /**
   * Deletes a user by id
   * @param userId The user id to delete
   */
  @Auth()
  @OpenApi()
  @Delete(':userId')
  public async delete(@Param('userId', UserIdValidator) userId: string): Promise<void> {
    await this.service.delete(userId);
  }

  /**
   * Adds an existing user to an existing company
   * @param userId The user id
   * @param companyId The company id
   */
  @Auth()
  @OpenApi()
  @Post(':userId/company/:companyId')
  public async addCompany(
    @Param('userId', UserIdValidator) userId: string,
    @Param('companyId', CompanyIdValidator) companyId: string,
  ): Promise<void> {
    await this.service.assignCompany(userId, companyId);
  }

  /**
   * Removes an existing user from an existing company
   * @param userId The user id
   * @param companyId The company id
   */
  @Auth()
  @OpenApi()
  @Delete(':userId/company/:companyId')
  public async deleteCompany(
    @Param('userId', UserIdValidator) userId: string,
    @Param('companyId', CompanyIdValidator) companyId: string,
  ): Promise<void> {
    await this.service.removeCompany(userId, companyId);
  }
}
