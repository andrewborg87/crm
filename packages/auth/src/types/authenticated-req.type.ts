import { Request } from 'express';

export interface AuthenticatedReq extends Request {
  user: {
    userId: string;
    sessionId: string;
  };
}
