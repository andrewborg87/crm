import { Role } from '@crm/types';

export type JwtPayloadType = {
  userId: string;
  sessionId: string;
  roles: {
    [companyId: string]: Role;
  };
  iat: number;
  exp: number;
};
