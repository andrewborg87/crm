import { Request } from 'express';

export interface RefreshReq extends Request {
  user: {
    sessionId: string;
    hash: string;
  };
}
