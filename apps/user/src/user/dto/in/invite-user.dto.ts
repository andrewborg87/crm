import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

import { toLowerCase } from '@crm/validation';

export class InviteUserDto {
  /** The email address of the user to invite */
  @Transform(toLowerCase)
  @IsEmail()
  email: string;
}
