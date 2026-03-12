import { User } from '@crm/types';

export class EmailLoginResDto {
  /** The authentication and refresh tokens */
  tokens: {
    auth: { token: string; expireMs: number };
    refresh: { token: string; expireMs: number };
  };

  /** The logged-in user */
  user: User;
}
