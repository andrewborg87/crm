import { IsString, Validate, IsNotEmpty } from 'class-validator';

import { PasswordValidator } from '@crm/validation';

export class ResetPasswordDto {
  /** The reset password token */
  @IsString()
  @IsNotEmpty()
  token: string;

  /** The new password */
  @Validate(PasswordValidator)
  password: string;
}
