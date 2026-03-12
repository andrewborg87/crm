import { User } from '@crm/types';

export class NewUserDto {
  /** The new user */
  user: User;

  /** The token to use for confirming the email */
  tokens: {
    confirmEmail: { token: string; expireMs: number };
  };
}
