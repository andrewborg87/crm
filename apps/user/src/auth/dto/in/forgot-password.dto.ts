import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

import { toLowerCase } from '@crm/validation';

export class ForgotPasswordDto {
  /** The email address of the user to send a forgot password */
  @Transform(toLowerCase)
  @IsEmail()
  email: string;
}
