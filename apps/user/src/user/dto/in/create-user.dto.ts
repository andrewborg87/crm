import { Transform } from 'class-transformer';
import { IsEmail, Validate, IsString, IsNotEmpty, IsOptional } from 'class-validator';

import { toLowerCase, PasswordValidator } from '@crm/validation';

export class CreateUserDto {
  /** The email address of the user */
  @Transform(toLowerCase)
  @IsEmail()
  email: string;

  /** The password of the user */
  @Validate(PasswordValidator)
  @IsNotEmpty()
  password: string;

  /** The first name of the user */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  firstName?: string;

  /** The last name of the user */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  lastName?: string;

  /** The invitation token for the user */
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  invitationToken?: string;
}
