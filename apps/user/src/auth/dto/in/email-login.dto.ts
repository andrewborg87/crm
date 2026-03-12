import { Transform } from 'class-transformer';
import { IsEmail, Validate, IsNotEmpty, IsOptional } from 'class-validator';

import { toLowerCase, PasswordValidator } from '@crm/validation';

export class EmailLoginDto {
  /** The email address of the user */
  @Transform(toLowerCase)
  @IsEmail()
  email: string;

  /** The password of the user */
  @Validate(PasswordValidator)
  @IsNotEmpty()
  password: string;

  /** The invitation token of the user */
  @IsOptional()
  @IsNotEmpty()
  invitationToken?: string | null;
}
