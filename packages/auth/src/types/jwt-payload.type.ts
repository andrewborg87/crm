export type JwtPayloadType = {
  userId: string;
  sessionId: string;
  iat: number;
  exp: number;
};
